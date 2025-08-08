import { FastifyInstance, FastifyRequest } from "fastify";
import { pipeline } from 'stream/promises';
import fs from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import currentUser from "../plugins/current-user.js";
// import sharp from 'sharp';

dotenv.config();

export default async function (server: FastifyInstance) {
    server.post('/api/users/avatar', {
    }, async (request: FastifyRequest, reply) => {
        try {
            const currentUser = request.currentUser;
            if (!currentUser) {
                return reply.code(404).send({ error: 'User not found' });
            }
            console.log(`Upload attempt for user ${currentUser.id}`);

            const uploadDir = '/app/uploads/';

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const user = await server.db.get(
                'SELECT avatar_url FROM users WHERE id = ?',
                [currentUser.id],
            );

            const data = await request.file();

            if (!data) {
                console.error('No file received');
                return reply.code(400).send({ error: 'No file provided' });
            }

            if (data.file.truncated) {
                console.error('File too large');
                return reply.code(413).send({ error: 'File size exceeds limit' });
            }

            const extension = path.extname(data.filename).toLowerCase();
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

            if (!allowedExtensions.includes(extension)) {
                console.error('Unauthorized extension:', extension);
                return reply.code(415).send({ error: 'Unsupported file type' });
            }

            const newFilename = `${randomUUID()}${extension}`;
            const uploadPath = path.join(uploadDir, newFilename);

            await pipeline(
                data.file,
                fs.createWriteStream(uploadPath)
            );

            const result = await server.db.run(
                'UPDATE users SET avatar_url = ? WHERE id = ?',
                [newFilename, currentUser.id],
            );

            if (result.changes === 0) {
                console.error('Database update failed');
                fs.unlinkSync(uploadPath);
                return reply.code(500).send({ error: 'Failed to update user avatar' });
            }

            if (currentUser.avatar_url && currentUser.avatar_url !== 'last_airbender.jpg') {
                const oldFilePath = path.join(uploadDir, currentUser.avatar_url);
                try {
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log('Old avatar deleted:', currentUser.avatar_url);
                    }
                } catch (deleteError) {
                    console.error('Error deleting old avatar:', deleteError);
                }
            } else if (currentUser.avatar_url === 'last_airbender.jpg') {
                console.log('Default avatar preserved:', currentUser.avatar_url);
            }

            console.log('Avatar updated successfully for', currentUser.id);
            return {
                avatarName: newFilename,
                avatarUrl: `/uploads/${newFilename}`,
                message: 'Avatar updated successfully'
            };

        } catch (error) {
            console.error('Upload error:', error);
            return reply.code(500).send({
                error: 'Internal server error',
            });
        }
    });
}

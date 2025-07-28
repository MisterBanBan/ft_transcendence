import { FastifyInstance } from "fastify";
import { pipeline } from 'stream/promises';
import fs from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
// import sharp from 'sharp';

// Load environment variables
dotenv.config();

export default async function (server: FastifyInstance) {
    server.post('/api/users/:id/avatar', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', pattern: '^\\d+$' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id;
            console.log(`Upload attempt for user ${userId}`);

            const uploadDir = '/app/uploads/';

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const data = await request.file();

            if (!data) {
                console.error('No file received');
                return reply.code(400).send({ error: 'No file provided' });
            }

            if (data.file.truncated) {
                console.error('File too large');
                return reply.code(413).send({ error: 'File size exceeds limit' });
            }

            // Extension validation
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
                [newFilename, userId]
            );

            if (result.changes === 0) {
                console.error('User not found:', userId);
                return reply.code(404).send({ error: 'User not found' });
            }

            console.log('Avatar updated successfully for', userId);
            return {
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

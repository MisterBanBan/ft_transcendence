import {FastifyInstance} from "fastify";
import { pipeline } from 'stream/promises';
import fs from 'fs';
import { randomUUID } from 'crypto';

export default async function (server: FastifyInstance) {
    server.post('/api/users/1/avatar', async (request, reply) => {
        console.log('Appel reçu sur /api/users/:id/avatar');

        const userId = (request.params as { id: string }).id;
        console.log(`User ID: ${userId}`);

        const data = await request.file();
        console.log('Fichier reçu:', data?.filename);

        if (!data || data.file.truncated) {
            return reply.code(400).send({ error: 'invalid file or size to big' });
        }

        const extension = data.filename.split('.').pop();
        const newFilename = `${randomUUID()}.${extension}`;
        const uploadPath = `./uploads/${newFilename}`;
        console.log(newFilename);

        await pipeline(
            data.file,
            fs.createWriteStream(uploadPath)
        );

        await server.db.run(
            'UPDATE users SET avatar_url = ? WHERE id = ?',
            [newFilename, userId]
        );

        return { avatarUrl: newFilename };
    });
}
import {FastifyInstance} from "fastify";
import { pipeline } from 'stream/promises';
import fs from 'fs';
import { randomUUID } from 'crypto';

export default async function (server: FastifyInstance) {
    server.post('/api/users/:id/avatar', async (request, reply) => {
        const userId = (request.params as { id: string }).id;
        const data = await request.file();

        if (!data || data.file.truncated) {
            return reply.code(400).send({ error: 'Fichier invalide ou taille dépassée' });
        }

        const extension = data.filename.split('.').pop();
        const newFilename = `${randomUUID()}.${extension}`;
        const uploadPath = `./uploads/${newFilename}`;

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
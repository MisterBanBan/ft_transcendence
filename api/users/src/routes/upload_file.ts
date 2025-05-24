import {FastifyInstance} from "fastify";
import fs from 'fs';
import path from "path";

export default async function (server: FastifyInstance) {
    server.get('/uploads/:filename', async (request, reply) => {
        try {
            const filename = (request.params as { filename: string }).filename;
            const filePath = path.join('./uploads', filename);

            if (!fs.existsSync(filePath)) {
                return reply.code(404).send({ error: 'File not found' });
            }

            reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            reply.header('Pragma', 'no-cache');
            reply.header('Expires', '0');

            const stream = fs.createReadStream(filePath);
            reply.type('image/jpeg');
            return reply.send(stream);
        } catch (error) {
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });
}

import { FastifyInstance } from 'fastify';
import fastifyMultipart, { MultipartFile } from '@fastify/multipart';

export default async function fileValidationConfig(server: FastifyInstance) {
    server.register(fastifyMultipart, {
        limits: {
            fileSize: 5 * 1024 * 1024,
            files: 1
        },
        onFile: async (part: MultipartFile) => {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const allowedExtensions = /\.(jpg|jpeg|png|webp)$/i;

            if (!allowedMimeTypes.includes(part.mimetype)) {
                throw new Error('Invalid file type');
            }

            if (!part.filename?.match(allowedExtensions)) {
                throw new Error('Invalid file extension');
            }
        }
    });
}

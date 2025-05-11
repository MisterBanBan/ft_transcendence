import { FastifyInstance } from 'fastify';

export default async function validationErrorHandler(server: FastifyInstance) {
    server.setErrorHandler((error, request, reply) => {
        if (error.message.includes('File size limit exceeded')) {
            reply.code(413).send({
                error: 'File too large',
                maxSize: '5MB'
            });
        }
        else if (error.message.includes('Invalid file')) {
            reply.code(400).send({
                error: 'Invalid file format',
                allowed: ['JPEG', 'PNG', 'WebP']
            });
        }
        else {
            reply.code(500).send({
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
}

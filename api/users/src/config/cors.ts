import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export default async function corsConfig(server: FastifyInstance) {
    server.register(cors, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition'],
        credentials: true,
        exposedHeaders: ['Content-Disposition']
    });
}

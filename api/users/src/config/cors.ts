import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export default async function corsConfig(server: FastifyInstance) {
    server.register(cors, {
        origin: process.env.FRONTEND_URL || 'https://localhost',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    });
}
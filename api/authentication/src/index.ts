import fastify from 'fastify';
import fastifyCookies from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyJWT from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const server = fastify();

const directoryPath = path.join(__dirname, '../');

import fs from 'fs/promises';

if (!process.env.JWT_SECRET) {
    console.log("Reading folder", directoryPath);

    try {
        const files = await fs.readdir(directoryPath);
        console.log('Contenu du dossier:', files);
    } catch (err) {
        console.error('Erreur lors de la lecture du dossier:', err);
    }

    throw new Error('JWT_SECRET environment variable is required');
}
server.register(fastifyStatic, {
    root: path.join(__dirname, 'src'),
    prefix: '/public/',
});

server.register(fastifyCookies, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
    parseOptions: {}
});

server.register(fastifyFormbody);

server.register(fastifyJWT, {
    secret: process.env.JWT_SECRET
});

server.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
});

server.get('/health', async (request, reply) => {
    reply.code(200).send({ status: 'healthy' });
});

server.get('/api/authentication/', async (request, reply) => {
    reply.send({ authentication: ["authentication1", "authentication2", "authentication3"] });
});

const start = async () => {
    try {
        await server.listen({ port: 8084, host: '0.0.0.0' });
        console.log('authentication service is running on port 8080');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

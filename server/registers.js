import { fastify } from './server.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import fstatic from '@fastify/static';
import cookie from '@fastify/cookie';
import formbody from '@fastify/formbody'
import jwt from '@fastify/jwt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, './.env') });
dotenv.config({ path: __dirname + './.env' });

fastify.register(fstatic, {
    root: path.join(__dirname, 'srcs'),
    prefix: '/public/',
});

fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
    parseOptions: {}
});

fastify.register(formbody);

fastify.register(jwt, {
    secret: process.env.JWT_SECRET
});
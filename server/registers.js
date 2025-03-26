import { fastify } from './server.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fstatic from '@fastify/static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fstatic, {
    root: path.join(__dirname, 'srcs'),
    prefix: '/public/',
});

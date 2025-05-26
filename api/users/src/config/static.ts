import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {FastifyInstance} from "fastify";
import staticFiles from '@fastify/static';
import path from 'path';

export default async function staticConf(server: FastifyInstance) {
    const filename = fileURLToPath(import.meta.url);
    const dir = dirname(filename);

    server.register(staticFiles, {
        root: path.join(dir, 'uploads'),
        prefix: '/uploads/',
        setHeaders: (res, path) => {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
    });
}
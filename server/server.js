import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import {promises as fs} from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fastify = Fastify({
  logger: true
});

// Register the static file plugin
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'srcs'),
  prefix: '/public/',
});

// Original route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' };
});

const scriptsDir = path.join(__dirname, 'scripts');

async function loadScripts() {
  try {
    const files = await fs.readdir(scriptsDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));

    for (const file of jsFiles) {
      const filePath = path.join(scriptsDir, file);
      try {
        console.log(`Importing file ${file}...`);
        await import(filePath);
        console.log(`File ${file} correctly imported`);
      } catch (error) {

        console.error(`Error while importing file ${file}:`, error.message);
        console.error(error.stack);
      }
    }
  } catch (error) {
    console.error('Error reading scripts directory:', error.message);
    console.error(error.stack);
    throw error;
  }
}

async function startServer() {
  try {

    await loadScripts();

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
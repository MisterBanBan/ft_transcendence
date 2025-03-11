import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

// Register the static file plugin
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'srcs'),
  prefix: '/public/',
});

// Serve HTML directly from a route
fastify.get('/html', async function (request, reply) {
  return reply.sendFile('html/index.html');
});

// Original route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' };
});

// Run the server!
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log('Server running on port 3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
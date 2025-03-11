// Change from CommonJS to ES Module syntax
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
});

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
});

// Run the server!
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log('Server running on port 3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

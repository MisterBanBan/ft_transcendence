import { fastify } from '../../../Users/app/server.js';

// Serve HTML directly from a route
fastify.get('/html', async function (request, reply) {
    return reply.sendFile('index.html');
});
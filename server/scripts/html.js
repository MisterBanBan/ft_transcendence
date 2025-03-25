import { fastify } from '../server.js';

// Serve HTML directly from a route
fastify.get('/html', async function (request, reply) {
    const token = request.cookies.token;
	if (!token)
		return reply.redirect('sign-up');
	else
        return reply.sendFile('index.html');
});
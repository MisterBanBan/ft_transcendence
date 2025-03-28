import { fastify } from '../../server.js';

fastify.addHook('onRequest', async (request, reply) => {
	const token = request.cookies.token
	const signRoutes = ['/sign-up', '/sign-in'];

	// if (!token && !signRoutes.includes(request.url))
	// 	return reply.redirect('/sign-in');
});
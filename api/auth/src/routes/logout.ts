import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/logout', async (request, reply) => {
		return reply.clearCookie("token").code(303).redirect('/');
	});
}
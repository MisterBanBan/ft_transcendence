import {FastifyInstance, FastifyReply} from "fastify";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/logout', async (request, reply: FastifyReply) => {
		return reply.clearCookie("token").code(200).send({});
	});
}
import { FastifyInstance } from "fastify";

export default async function (server: FastifyInstance) {
	server.get('/health', async (request, reply) => {
		reply.code(200).send({ status: 'healthy' });
	});
}
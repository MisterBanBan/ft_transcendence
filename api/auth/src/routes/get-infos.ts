import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/get-infos', async function (request, reply) {

		const token = request.cookies.token;

		try {
			const data = server.jwt.decode(token);

			return reply.send(data);
		} catch {
			return reply.send(false);
		}
	});
}
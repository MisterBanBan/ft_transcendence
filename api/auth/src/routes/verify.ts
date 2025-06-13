import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {decodeToken} from "../utils/decode-token.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/verify', async (request: FastifyRequest, reply: FastifyReply) => {

		const token = request.cookies?.token;

		if (!token) return reply.send(false);

		try {
			await decodeToken(server, token, reply);
		} catch {
			return reply.send(false);
		}
	});
}
import {FastifyInstance} from "fastify";
import {decodeToken} from "../utils/decode-token.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/verify', async function (request, reply) {

		console.log("GET /api/auth/verify");

		const cookieOptions = {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: true
		};

		const token = request.cookies?.token;

		if (!token) return reply.send(false);

		try {
			await decodeToken(server, token, reply);
		} catch {
			return reply.send(false);
		}
	});
}
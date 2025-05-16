import {FastifyInstance} from "fastify";
import {TokenPayload} from "../interface/token-payload.js";
import {verifyToken} from "../db/verify-token.js";

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
			const decodedToken = server.jwt.decode(token) as TokenPayload;
			const isValid = await verifyToken(server.db, decodedToken);
			if (!isValid) {
				return reply.clearCookie('token', cookieOptions).send(false);
			}
			return reply.send(isValid);
		} catch {
			return reply.clearCookie('token', cookieOptions).send(false);
		}
	});
}
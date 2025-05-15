import {FastifyInstance} from "fastify";
import {TokenPayload} from "../types/tokenPayload.js";
import {verifyToken} from "../db/verifyToken.js";

export default async function (server: FastifyInstance) {
    server.get('/api/auth/verify', async function (request, reply) {

		console.log("GET /api/auth/verify");

		const cookieOptions = {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: true
		};

        if (request.cookies && request.cookies.token)
		{
			let token;
			try {
				token = server.jwt.decode(request.cookies.token) as TokenPayload;
			} catch (e) {
				return reply.clearCookie('token', cookieOptions).send(false);
			}

			return reply.send(await verifyToken(server.db, token));
		}
		return reply.send(false);
    });
}
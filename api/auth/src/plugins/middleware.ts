import {FastifyInstance, FastifyRequest} from "fastify";
import {decodeToken} from "../utils/decode-token.js";
import {getUserByUsername} from "../db/get-user-by-username.js";

export default async function (server: FastifyInstance) {
	server.addHook('preHandler', async (request, reply) => {

		const authorizedRoutes = [
			"/api/auth/login",
			"/api/auth/register",
			"/api/auth/2fa/validate",
			"/api/auth/callback/42",
			"/api/auth/callback/google",
			"/api/auth/verify",
			"/health"
		]

		const path = request.raw.url?.split('?')[0];

		if (path && authorizedRoutes.includes(path)) {
			return;
		}

		const token = request.cookies?.token

		if (!token) {
			return reply.status(302).redirect('/auth');
		}

		const decodedToken = await decodeToken(server, token, reply);
		if (decodedToken === undefined) {
			return reply.status(302).redirect("/auth");
		}

		(request as any).currentUser = await getUserByUsername(server.db, decodedToken.username);
	});
}
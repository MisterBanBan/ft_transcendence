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
			"/api/auth/get-infos",
			"/health"
		]

		const forbiddenRoutes = [
			"/api/auth/register",
			"/api/auth/login",
		];

		const path = request.raw.url?.split('?')[0];
		const token = request.cookies?.token;
		const decodedToken = token ? await decodeToken(server, token, reply) : undefined;

		if (path) {
			if (forbiddenRoutes.includes(path) && decodedToken) {
				return reply.status(403).send({
					error: "Forbidden",
					message: "Already authenticated."
				});
			}

			if (authorizedRoutes.includes(path)) {
				return;
			}
		}

		if (!decodedToken) {
			return reply.status(401).send({
				error: "Unauthorized",
				message: "You are not connected"
			});
		}

		(request as any).currentUser = await getUserByUsername(server.db, decodedToken.username);
	});
}
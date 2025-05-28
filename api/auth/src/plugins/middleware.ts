import {FastifyInstance} from "fastify";
import {decodeToken} from "../utils/decode-token.js";

export default async function (server: FastifyInstance) {
	server.addHook('preHandler', async (request, reply) => {

		console.log("preHandler called");
		const authorizedRoutes = [
			"/api/auth/login",
			"/api/auth/register",
			"/api/auth/2fa",
			"/api/auth/callback",
			"/api/auth/verify",
			"/health"
		]

		const path = request.raw.url?.split('?')[0];

		if (path && authorizedRoutes.includes(path)) {
			return;
		}

		console.log(path, "not an authorized route");

		const token = request.cookies?.token

		console.log(token);
		if (!token)
			return reply.redirect('/auth');

		if (await decodeToken(server, token, reply) === undefined) {
			return reply.redirect("/auth");
		}
	});
}
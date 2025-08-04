import {FastifyInstance} from "fastify";
import {decodeToken} from "../utils/decode-token.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {getAvatar} from "../db/get-avatar.js";

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

		const user = await getUserByUsername(server.authDb, decodedToken.username)

		if (!user) {
			return reply.status(500).send({
				error: "Internal Server Error",
				message: "An error occurred while getting the current user"
			})
		}

		const avatar_url = await getAvatar(server.usersDb, decodedToken.username);

		console.log(user);

		request.headers['x-current-user'] = Buffer.from(JSON.stringify({
			id: user.id!,
			username: user.username,
			avatar_url: avatar_url,
			provider: user.provider,
			provider_id: user.provider_id,
			tfa: Boolean(user.tfa),
			updatedAt: user.updatedAt
		})).toString('base64');
	});
}
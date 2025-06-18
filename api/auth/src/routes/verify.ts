import {getUserByUsername} from "../db/get-user-by-username.js";
import {decodeToken} from "../utils/decode-token.js";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {getAvatar} from "../db/get-avatar.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/verify', async (request: FastifyRequest, reply: FastifyReply) => {

		const token = request.cookies?.token;

		if (!token) return reply.send(false);

		let decodedToken = undefined

		try {
			decodedToken = await decodeToken(server, token, reply);
		} catch {
			return reply.code(404).send(undefined);
		}

		if (!decodedToken) {
			return reply.code(404).send(undefined);
		}

		const user = await getUserByUsername(server.db, decodedToken.username)

		if (!user) {
			return reply.status(500).send({
				error: "Internal Server Error",
				message: "An error occurred while getting the current user"
			})
		}

		const avatar_url = await getAvatar(server.usersDb, decodedToken.username);

		return reply.code(200).send({
			id: user.id!,
			username: user.username,
			avatar_url: avatar_url,
			provider: user.provider,
			provider_id: user.provider_id,
			tfa: Boolean(user.tfa),
			updatedAt: user.updatedAt
		});
	});
}
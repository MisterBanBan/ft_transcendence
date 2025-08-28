import {FastifyInstance} from "fastify";
import crypto from "crypto"
import authenticator from "authenticator";
import {getUserByUsername} from "../../db/get-user-by-username.js";
import {setCookie} from "../../utils/set-cookie.js";
import {getAvatar} from "../../db/get-avatar.js";

const tempKeys = new Map<string, { username: string, authToken: string, eat: number }>();

export async function createToken(username: string, authToken: string): Promise<string> {
	const token = crypto.randomUUID();

	tempKeys.set(token, { username, authToken, eat: Date.now() + (2 * 60 * 1000) });

	return token;
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/2fa/validate', {
		schema: {
			body: {
				type: "object",
				required: ["token", "code"],
				properties: {
					token: { type: "string" },
					code: { type: "string" },
				},
			},
		}
	}, async (request, reply) => {
		const { token, code } = request.body as { token: string; code: string };

		const key = tempKeys.get(token);
		if (!key || key.eat < Date.now()) {
			if (key)
				tempKeys.delete(token);
			return reply.status(400).send({
				error: "Bad Request",
				message: "Invalid or expired 2FA session"
			});
		}

		const user = await getUserByUsername(server.db, key.username);
		if (!user || !user.tfa)
			return reply.status(404).send({
				error: "Not Found",
				message: "User not found or doesn't have 2FA activated",
			});

		if (!/^\d{6}$/.test(code) || !authenticator.verifyToken(user.tfa, code))
			return reply.status(400).send({
				error: "Bad Request",
				message: "Invalid 2FA Code"
			});

		tempKeys.delete(token);

		await setCookie(reply, key.authToken);

		const avatar_url = await getAvatar(server.usersDb, user.username);

		return reply.status(200).send({
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
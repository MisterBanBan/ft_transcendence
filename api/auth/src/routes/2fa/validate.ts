import {FastifyInstance} from "fastify";
import "crypto"
import authenticator from "authenticator";
import {getUserByUsername} from "../../db/get-user-by-username.js";

const tempKeys = new Map<string, { username: string, authToken: string, eat: number }>();

export async function createToken(username: string, authToken: string): Promise<string> {
	const token = crypto.randomUUID();

	tempKeys.set(token, { username, authToken, eat: Date.now() * 2 * 60 * 1000 });

	return token;
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/2fa/validate', async function (request, reply) {
		const { token, code } = request.body as { token: string; code: string };

		const key = tempKeys.get(token);
		if (!key || key.eat < Date.now())
		{
			if (key)
				tempKeys.delete(token);
			return reply.status(403).send({ error: ["Invalid or expired 2FA session"], type: "popup" });
		}


		const user = await getUserByUsername(server.db, key.username);
		if (!user || !user.tfa)
			return reply.status(404).send({ error: "User not found or doesn't have 2FA activated", type: "popup" });
		if (!/^\d{6}$/.test(code) || !authenticator.verifyToken(user.tfa, code))
			return reply.status(400).send({error: ["Invalid 2FA Code"], type: "popup"});

		tempKeys.delete(token);
		return reply.setCookie('token', key.authToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 3600
		}).status(302).send({ success: true });
	});
}
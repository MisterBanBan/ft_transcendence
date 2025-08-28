import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {createToken} from "./2fa/validate.js"
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import {verifyPassword} from "../utils/verify-password.js";
import { getAvatar } from '../db/get-avatar.js';

export default async function (server: FastifyInstance) {
	server.post('/api/auth/login', {
		schema: {
			body: {
				type: "object",
				required: ["username", "password"],
				properties: {
					username: { type: "string", minLength: 1 },
					password: { type: "string", minLength: 1 },
				},
				additionalProperties: false,
			},
		}
	}, async (request, reply) => {

		const {username, password} = request.body as { username: string; password: string };

		try {

			const user = await getUserByUsername(server.db, username);

			if (user == undefined || (user && user.provider != 'local')) {
				return reply.status(400).send({
					error: 'Bad Request',
					message: "Invalid username."
				});
			}

			if (!await verifyPassword(user, password)) {
				return reply.status(400).send({
					error: 'Bad Request',
					message: 'Invalid password.'
				});
			}

			const tokenData: TokenPayload = {
				provider: "local",
				id: user.id!,
				username: user.username,
				tfa: Boolean(user.tfa),
				updatedAt: user.updatedAt
			};

			const token = await signToken(server, tokenData);

			if (user.tfa) {
				return reply.status(401).send({
					status: "2FA-REQUIRED",
					token: await createToken(user.username, token)
				});
			}

			await setCookie(reply, token);

			const currentUser = {
				id: user.id!,
				username: user.username,
				avatar_url: await getAvatar(server.usersDb, user.username),
				provider: user.provider,
				provider_id: user.provider_id,
				tfa: Boolean(user.tfa),
				updatedAt: user.updatedAt
			};

			return reply.status(200).send({ status: "LOGGED-IN", user: currentUser });

		} catch (err) {
			return reply.status(500).send({
				error: "Internal Server Error",
				message: err
			});
		}
	});
}
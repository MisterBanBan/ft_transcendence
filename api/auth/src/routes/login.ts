import argon2 from 'argon2';
import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {createToken} from "./2fa/validate.js"
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import {verifyPassword} from "../utils/verify-password.js";

interface Cookie {
	path: string,
	httpOnly: boolean,
	secure: boolean,
	maxAge: number
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/login', async function (request, reply) {

		const {username, password} = request.body as { username: string; password: string };

		if (request.cookies?.token) {
			return reply.status(401).send({
				error: "Already logged",
				type: "global"
			});
		}

		try {

			const user = await getUserByUsername(server.db, username);

			if (user == undefined) {
				return reply.status(400).send({
					error: "Invalid username.",
					type: "username"
				});
			}

			if (user && user.provider != 'local') {
				return reply.status(400).send({
					error: `Invalid username or your username may have changed because of an external provider (try ${user.username}1).`,
					type: "global"
				});
			}

			const tokenData: TokenPayload = {
				provider: "local",
				id: user.id!,
				username: user.username,
				updatedAt: user.updatedAt
			};

			const token = await signToken(server, tokenData);

			if (!await verifyPassword(user, password)) {
				return reply.status(400).send({
					error: "Invalid password.",
					type: "password"
				});
			}

			if (user.tfa) {
				return reply.status(401).send({
					status: "2FA-REQUIRED",
					token: await createToken(user.username, token)
				});
			}

			await setCookie(reply, token);
			return reply.status(200).send({ status: "LOGGED-IN" });

		} catch (err) {
			return reply.status(400).send({
				error: err,
				type: "global"
			});
		}
	});
}
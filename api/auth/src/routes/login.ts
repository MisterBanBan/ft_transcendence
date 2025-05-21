import argon2 from 'argon2';
import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {getIdByUser} from "../db/get-id-by-user.js";
import authenticator from "authenticator";

interface Cookie {
	path: string,
	httpOnly: boolean,
	secure: boolean,
	maxAge: number
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/login', async function (request, reply) {

		console.log("POST /api/auth/login");
		const {username, password, code} = request.body as { username: string; password: string, code: string };

		if (request.cookies && request.cookies.token)
			return reply.status(400).send({error: ["Already logged."], type: "global"});

		try {

			const user = await getUserByUsername(server.db, username);
			const id = await getIdByUser(server.db, username);

			if (user == undefined || id == undefined)
				return reply.status(400).send({error: ["Invalid username."], type: "username"});

			const tokenData: TokenPayload = { id, username: user.username, updatedAt: user.updatedAt };
			const token = server.jwt.sign(tokenData, { noTimestamp: true });

			const cookie = {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: true,
				maxAge: 3600
			} as Cookie;

			if (await argon2.verify(user.password, password, { secret: Buffer.from(process.env.ARGON_SECRET!)})) {

				if (user.tfa)
				{
					try {
						if (!/^\d{6}$/.test(code) || !authenticator.verifyToken(user.tfa, code))
							return reply.status(400).send({error: ["Invalid 2FA Code"], type: "code"});
					} catch {
						return reply.status(400).send({error: ["Error while verifying 2FA Code"], type: "code"});
					}
				}

				return reply.setCookie('token', token, cookie).status(200).send();
			} else
				return reply.status(400).send({error: ["Invalid password."], type: "password"});
		} catch (err) {
			return reply.status(400).send({error: [err], type: "global"});
		}
	});
}
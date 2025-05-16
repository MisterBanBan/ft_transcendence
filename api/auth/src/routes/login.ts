import argon2 from 'argon2';
import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../db/getUserByUsername.js";
import {TokenPayload} from "../types/tokenPayload.js";

interface Cookie {
	path: string,
	httpOnly: boolean,
	secure: boolean,
	maxAge: number
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/login', async function (request, reply) {

		const {username, password} = request.body as { username: string; password: string };

		if (request.cookies && request.cookies.token)
			return reply.status(400).send({error: ["Already logged."], type: "global"});

		try {

			const user = await getUserByUsername(server.db, username);

			if (user == undefined)
				return reply.status(400).send({error: ["Invalid username."], type: "username"});

			const tokenData: TokenPayload = { username: user.username, updatedAt: user.updatedAt };
			const token = server.jwt.sign(tokenData, { noTimestamp: true });

			const cookie = {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: true,
				maxAge: 3600
			} as Cookie;

			if (await argon2.verify(user.password, password)) {
				return reply.setCookie('token', token, cookie).status(200).send({
					error: [`Successfully registered`],
					type: "global"
				});
			} else
				return reply.status(400).send({error: ["Invalid password."], type: "password"});
		} catch (err) {
			return reply.status(400).send({error: [err], type: "global"});
		}
	});
}
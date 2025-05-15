import argon2 from 'argon2';
import {FastifyInstance} from "fastify";
import {User} from "../types/user.js";
import {getUserByEmail} from "../db/getUserByEmail.js";
import {getUserByUsername} from "../db/getUserByUsername.js";
import {TokenPayload} from "../types/tokenPayload.js";
import {verifyToken} from "../db/verifyToken.js";

interface Cookie {
	path: string,
	httpOnly: boolean,
	secure: boolean,
	maxAge: number
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/login', async function (request, reply) {

		const {identifier, password} = request.body as { identifier: string; password: string };

		if (request.cookies && request.cookies.token)
			return reply.status(400).send({error: ["Already logged."], type: "global"});

		try {

			let user: User | undefined;
			if (identifier.includes("@"))
				user = await getUserByEmail(server.db, identifier);
			else
				user = await getUserByUsername(server.db, identifier);

			if (user == undefined)
				return reply.status(400).send({error: ["Invalid email or username."], type: "identifier"});

			const tokenData: TokenPayload = { username: user.username, email: user.email, updatedAt: user.updatedAt };
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
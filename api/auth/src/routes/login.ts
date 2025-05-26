import argon2 from 'argon2';
import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {getIdByUsername} from "../db/get-id-by-username.js";
import {createToken} from "./2fa/validate.js"

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
			const id = await getIdByUsername(server.db, username);

			if (user == undefined || id == undefined || (user && user.provider != 'local'))
				return reply.status(400).send({error: ["Invalid username."], type: "username"});

			const tokenData: TokenPayload = {provider: "local", id, username: user.username, updatedAt: user.updatedAt };
			const token = server.jwt.sign(tokenData, { noTimestamp: true });

			const cookieOpts = {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: true,
				maxAge: 3600
			} as Cookie;

			if (await argon2.verify(user.password!, password, { secret: Buffer.from(process.env.ARGON_SECRET!)})) {
				if (!user.tfa)
					return reply.setCookie('token', token, cookieOpts).status(200).send({ status: "LOGGED-IN" });
				else
					return reply.status(401).send({ status: "2AF-REQUIRED", token: await createToken(user.username, token) });
			} else
				return reply.status(400).send({error: ["Invalid password."], type: "password"});
		} catch (err) {
			return reply.status(400).send({error: [err], type: "global"});
		}
	});
}
import fs from 'fs';
import argon2 from 'argon2';
import {FastifyInstance} from "fastify";

interface User {
	email: string;
	hash: string;
	token: string;
}

interface Cookie {
	path: string,
	httpOnly: boolean,
	secure: boolean,
	maxAge: number
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/login', async function (request, reply) {

		console.log("POST /api/auth/login");
		const {email, password} = request.body as { email: string; password: string };

		try {

			let users: User[] = [];
			if (fs.existsSync("users.json")) {
				const data = fs.readFileSync("users.json", "utf-8");
				if (data) users = JSON.parse(data);
			} else
				return reply.status(400).send({error: ["No users.json file found"], type: "global"});

			let token;

			const user = users.find((user: User) => user.email === email);
			if (user)
				token = user.token;
			else {
				return reply.status(400).send({error: ["Invalid email."], type: "email"});
			}

			console.log("Find user:", user);

			const cookie = {
				path: '/',
				httpOnly: true,
				secure: false,
				maxAge: 3600
			} as Cookie;

			if (await argon2.verify(user.hash, password)) {
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
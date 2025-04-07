import { fastify } from '../../../server.js';
import fs from 'fs';
import argon2 from 'argon2';

fastify.get('/sign-in', async function (request, reply) {

	const token = request.cookies.token;
	if (!token)
		return reply.sendFile('sign-in.html');
	else
		return reply.send("You are already authentificated.");
});

fastify.post('/sign-in', async function (request, reply) {

	const { email, password } = request.body;

	try {

		let users = [];
		if (fs.existsSync("users.json")) {
			console.log("Read file");
			const data = fs.readFileSync("users.json", "utf-8");
			if (data) users = JSON.parse(data);
		}
		else
			return reply.status(400).send({ error: ["No users.json file found"], type: "global"});

		let token;

		const user = users.find(user => user.email === email);
		if (user)
			token = user.token;
		else {
			return reply.status(400).send({ error: ["Invalid email."], type: "email" });
		}

		if (await argon2.verify(user.hash, password)) {
			return reply.setCookie('token', token, {
				path: '/',
				httpOnly: true,
				secure: false,
				maxAge: 3600
			}).status(200).redirect('/html' +
				'');
		} else
			return reply.status(400).send({ error: ["Invalid password."], type: "password" });
	} catch (err) {
		return reply.status(400).send({ error: [err], type: "global" });
	}

});
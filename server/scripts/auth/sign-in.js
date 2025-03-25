import { fastify } from '../../server.js';
import { error } from './error.js';
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

	console.log("Sign in request");
	const { email, password } = request.body;

	try {

		let users = [];
		if (fs.existsSync("users.json")) {
			console.log("Read file");
			const data = fs.readFileSync("users.json", "utf-8");
			if (data) users = JSON.parse(data);
		}
		else
			return reply.send("No users.json file found");

		let token;

		const user = users.find(user => user.email === email);
		if (user)
			token = user.token;
		else {
			error("Invalid email");
			return reply.redirect('sign-in');
		}

		if (await argon2.verify(user.hash, password)) {
			return reply.setCookie('token', token, {
				path: '/',
				httpOnly: true,
				secure: false,
				maxAge: 3600
			}).redirect('html');
		} else {
			error("Invalid password");
			return reply.redirect('sign-in');
		}
	} catch (err) {
		return reply.redirect('sign-in');
	}

});
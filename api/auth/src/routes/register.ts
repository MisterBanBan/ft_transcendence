import argon2 from "argon2";
import fs from "fs";
import {FastifyInstance} from "fastify";
import {insertAuthentication} from "../db/insertAuthentication.js";

interface User {
	username: string;
	email: string;
	hash: string;
	timestamp: number;
}

export default async function (server: FastifyInstance) {
	server.post('/api/auth/register', async (request, reply) => {

		console.log("POST /api/auth/register");
		console.log(request.body);

		const {username, email, password, cpassword} = request.body as { username: string, email: string; password: string, cpassword: string };

		if (!username || !email || !password || !cpassword) {
			return reply.status(400).send({error: ['Tous les champs sont requis.'], type: 'global'});
		}

		const errUsername = validateUsername(username);
		if (errUsername)
			return reply.status(400).send({error: ['Invalid username.'], type: "username"});

		const errEmail = validateEmail(email);
		if (errEmail)
			return reply.status(400).send({error: ['Invalid email.'], type: "email"});

		const errPassword = validatePassword(password, cpassword)
		if (errPassword)
			return reply.status(400).send({error: errPassword, type: "password"});

		let hash;

		try {
			hash = await argon2.hash(password);
		} catch (err) {
			return reply.status(400).send({
				error: [`An error occurred while registering a password: ${err}.`],
				type: "password"
			});
		}

		try {
			let users: User[] = [];
			if (fs.existsSync("users.json")) {
				const data = fs.readFileSync("users.json", "utf-8");
				if (data) users = JSON.parse(data);
			}

			if (users.some((user: User) => user.username === username)) {
				return reply.status(400).send({error: ["Username already in use."], type: "username"});
			}
			else if (users.some((user: User) => user.email === email)) {
				return reply.status(400).send({error: ["Email already in use."], type: "email"});
			}

			console.log("\x1b[32mCreating token\x1b[0m");
			const token = server.jwt.sign({email});

			const timestamp = Date.now();
			const userData = {username, email, hash, timestamp};

			users.push(userData);
			await fs.promises.writeFile("users.json", JSON.stringify(users, null, 2));

			insertAuthentication(server.db, username, email, hash, timestamp);

			return reply.setCookie('token', token, {
				path: '/',
				httpOnly: true,
				secure: false,
				maxAge: 3600
			}).status(200).send({error: [`Successfully registered`], type: "global"});

		} catch (err) {
			return reply.status(400).send({error: [`An error occurred: ${err}.`], type: "global"});
		}
	})

	function validateUsername(username: string) {
		const regex = /^[a-zA-Z0-9]{3,16}$/;
		return !regex.test(username);
	}

	function validateEmail(email: string) {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return !emailRegex.test(email);
	}

	function validatePassword(password: string, cpassword: string) {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const isLongEnough = password.length >= minLength;
		const samePassword = password === cpassword

		if (isLongEnough && hasUpperCase && hasNumber && hasSpecialChar && samePassword) {
			return false;
		}

		const errors = [];
		if (!isLongEnough) errors.push("The password needs at least 8 characters.");
		if (!hasUpperCase) errors.push("The password needs at least 1 upper case.");
		if (!hasNumber) errors.push("The password needs at least 1 number.");
		if (!hasSpecialChar) errors.push("The password needs at least 1 special character.");
		if (!samePassword) errors.push("Passwords don't match.");

		return errors;
	}
}
import argon2 from "argon2";
import {FastifyInstance} from "fastify";
import {addUser} from "../db/addUser.js";
import {User} from "../types/user.js";
import {getUserByUsername} from "../db/getUserByUsername.js";
import {getUserByEmail} from "../db/getUserByEmail.js";
import {TokenPayload} from "../types/tokenPayload.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/register', async (request, reply) => {

		let {username, email, password, cpassword} = request.body as { username: string, email: string; password: string, cpassword: string };

		if (request.cookies && request.cookies.token)
			return reply.status(400).send({error: ["Already logged."], type: "global"});

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

		try {
			password = await argon2.hash(password);
		} catch (err) {
			return reply.status(400).send({
				error: [`An error occurred while registering a password: ${err}.`],
				type: "password"
			});
		}

		try {
			let user = await getUserByUsername(server.db, username);
			if (user)
				return reply.status(400).send({error: ["Username already in use."], type: "username"});

			user = await getUserByEmail(server.db, email);
			if (user)
				return reply.status(400).send({error: ["Email already in use."], type: "email"});

			console.log("\x1b[32mCreating token\x1b[0m");

			const timestamp = Date.now();
			const userData: User = {username, email, password, updatedAt: timestamp };
			const tokenData: TokenPayload = { username, email, updatedAt: timestamp };
			const token = server.jwt.sign(tokenData, { noTimestamp: true});

			await addUser(server.db, userData);

			return reply.setCookie('token', token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: true,
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
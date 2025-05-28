import argon2 from "argon2";
import {FastifyInstance} from "fastify";
import {addUser} from "../db/add-user.js";
import {User} from "../interface/user.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/register', async (request, reply) => {

		let {username, password, cpassword} = request.body as { username: string, password: string, cpassword: string };

		if (request.cookies?.token)
			return reply.status(400).send({error: ["Already logged."], type: "global"});

		if (!username || !password || !cpassword) {
			return reply.status(400).send({error: ['Tous les champs sont requis.'], type: 'global'});
		}

		const errUsername = validateUsername(username);
		if (errUsername)
			return reply.status(400).send({error: ['Invalid username.'], type: "username"});

		const errPassword = validatePassword(password, cpassword)
		if (errPassword)
			return reply.status(400).send({error: errPassword, type: "password"});

		try {
			password = await argon2.hash(password, {secret: Buffer.from(process.env.ARGON_SECRET!)});
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

			console.log("\x1b[32mCreating token\x1b[0m");

			const timestamp = Date.now();
			const userData: User = {provider: "local", username, password, tfa: undefined ,updatedAt: timestamp };

			const id = await addUser(server.db, userData);
			if (id == undefined)
				return reply.status(400).send({error: ["An error occured while registering."], type: "global"});

			const tokenData: TokenPayload = {provider: "local", id: id, username, updatedAt: timestamp };
			const token = server.jwt.sign(tokenData, { noTimestamp: true});

			return reply.setCookie('token', token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: true,
				maxAge: 3600
			}).status(200).send();

		} catch (err) {
			return reply.status(400).send({error: [`An error occurred: ${err}.`], type: "global"});
		}
	})

	function validateUsername(username: string) {
		const regex = /^[a-zA-Z0-9\-]{3,16}$/;
		return !regex.test(username);
	}

	function validatePassword(password: string, cpassword: string) {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const isLongEnough = password.length >= minLength;
		const samePassword = password === cpassword

		const errors = [] as string[];
		if (!isLongEnough) errors.push("The password needs at least 8 characters.");
		if (!hasUpperCase) errors.push("The password needs at least 1 upper case.");
		if (!hasNumber) errors.push("The password needs at least 1 number.");
		if (!hasSpecialChar) errors.push("The password needs at least 1 special character.");
		if (!samePassword) errors.push("Passwords don't match.");

		if (errors.length > 0)
			return errors;

		return false;
	}
}
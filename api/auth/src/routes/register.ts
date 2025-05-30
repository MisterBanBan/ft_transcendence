import argon2 from "argon2";
import {FastifyInstance} from "fastify";
import {addUser} from "../db/add-user.js";
import {User} from "../interface/user.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import {validatePassword} from "../utils/validate-password.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/register', async (request, reply) => {

		let {username, password, cpassword} = request.body as { username: string, password: string, cpassword: string };

		if (request.cookies?.token)
			return reply.status(400).send({error: "Already logged.", type: "global"});

		if (!username || !password || !cpassword) {
			return reply.status(400).send({error: 'Tous les champs sont requis.', type: 'global'});
		}

		const errUsername = validateUsername(username);
		if (errUsername)
			return reply.status(400).send({error: 'Invalid username.', type: "username"});

		const errPassword = await validatePassword(password, cpassword)
		if (errPassword)
			return reply.status(400).send({error: errPassword, type: "password"});

		try {
			password = await argon2.hash(password, {secret: Buffer.from(process.env.ARGON_SECRET!)});
		} catch (err) {
			return reply.status(400).send({
				error: `An error occurred while registering a password: ${err}.`,
				type: "password"
			});
		}

		try {
			let user = await getUserByUsername(server.db, username);
			if (user)
				return reply.status(400).send({error: "Username already in use.", type: "username"});

			console.log("\x1b[32mCreating token\x1b[0m");

			const timestamp = Date.now();
			const userData: User = {provider: "local", username, password, tfa: undefined ,updatedAt: timestamp };

			const id = await addUser(server.db, userData);
			if (id == undefined)
				return reply.status(400).send({error: "An error occured while registering.", type: "global"});

			const tokenData: TokenPayload = {provider: "local", id: id, username, updatedAt: timestamp };
			const token = await signToken(server, tokenData);

			await setCookie(reply, token);

			return reply.status(200).send({});

		} catch (err) {
			return reply.status(400).send({error: `An error occurred: ${err}.`, type: "global"});
		}
	})

	function validateUsername(username: string) {
		const regex = /^[a-zA-Z0-9\-]{3,16}$/;
		return !regex.test(username);
	}
}
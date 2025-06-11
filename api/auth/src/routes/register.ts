import argon2 from "argon2";
import {FastifyInstance} from "fastify";
import {addUser} from "../db/add-user.js";
import {User} from "../interface/user.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import {validatePassword} from "../utils/validate-password.js";
import {validateUsername} from "../utils/validate-username.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/register', {
		schema: {
			body: {
				type: "object",
				required: ["username", "password", "cpassword"],
				properties: {
					username: { type: "string", minLength: 3, maxLength: 16 },
					password: { type: "string", minLength: 8 },
					cpassword: { type: "string", minLength: 8 }
				},
			},
			response: {
				200: {
					type: "object",
					properties: {},
					additionalProperties: false,
				},
			}
		}
	}, async (request, reply) => {

		let {username, password, cpassword} = request.body as {
			username: string,
			password: string,
			cpassword: string
		};

		const errUsername = await validateUsername(username);
		if (!errUsername) {
			return reply.status(400).send({
				error: 'Bad Request',
				message: 'Invalid username.',
			});
		}

		const errPassword = await validatePassword(password, cpassword)
		if (errPassword) {
			return reply.status(400).send({
				error: 'Bad Request',
				message: errPassword,
			});
		}

		try {
			password = await argon2.hash(password, {secret: Buffer.from(process.env.ARGON_SECRET!)});
		} catch (err) {
			return reply.status(500).send({
				error: 'Internal Server Error',
				message: `An error occurred while registering a password: ${err}.`
			});
		}

		try {
			let user = await getUserByUsername(server.db, username);
			if (user) {
				return reply.status(400).send({
					error: 'Bad Request',
					message: "Username already in use.",
				});
			}

			const timestamp = Date.now();
			const userData: User = {
				provider: "local",
				username: username,
				password: password,
				tfa: undefined,
				updatedAt: timestamp
			};

			const id = await addUser(server.db, userData);
			if (id == undefined) {
				return reply.status(500).send({
					error: 'Internal Server Error',
					message: 'An error occured while registering.',
				});
			}

			const tokenData: TokenPayload = {
				provider: "local",
				id: id, username,
				updatedAt: timestamp
			};

			const token = await signToken(server, tokenData);

			await setCookie(reply, token);

			return reply.status(200).send({ success: true });

		} catch (err) {
			return reply.status(500).send({
				error: 'Internal Server Error',
				message: `An error occurred: ${err}.`,
			});
		}
	})


}
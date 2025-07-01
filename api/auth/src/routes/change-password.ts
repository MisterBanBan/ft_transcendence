import {FastifyInstance, FastifyRequest} from "fastify";
import {TokenPayload} from "../interface/token-payload.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import argon2 from "argon2";
import {changeUsername} from "../db/change-username.js";
import {changePassword} from "../db/change-password.js";
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import * as repl from "node:repl";
import {validatePassword} from "../utils/validate-password.js";
import {verifyPassword} from "../utils/verify-password.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/change-password', {
		schema: {
			body: {
				type: "object",
				required: ["currentPassword", "newPassword", "confirmNewPassword"],
				properties: {
					currentPassword: { type: "string", minLength: 1 },
					newPassword: { type: "string", minLength: 8 },
					confirmNewPassword: { type: "string", minLength: 8 }
				},
				additionalProperties: false,
			},
			response: {
				200: {
					type: "object",
					properties: {},
					additionalProperties: false,
				},
			}
		}
	}, async (request: FastifyRequest, reply) => {
		const { currentPassword, newPassword, confirmNewPassword } = request.body as {
			currentPassword: string,
			newPassword: string,
			confirmNewPassword: string
		};

		const user = request.currentUser;
		if (!user) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		if (user.provider != "local") {
			return reply.code(403).send({
				error: "Forbidden",
				message: `Since you are using a different provider (${user.provider}) than transcendence, you can't change your password`,
			});
		}

		const dbUser = await getUserByUsername(server.db, user.username)
		if (!dbUser) {
			return reply.code(500).send({
				error: "Internal Server Error",
				message: `An error occurred while getting user`,
			})
		}

		if (!await verifyPassword(dbUser, currentPassword)) {
			return reply.code(400).send({
				error: "Bad Request",
				message: "Invalid password",
			});
		}

		const isValid = await validatePassword(newPassword, confirmNewPassword);
		if (isValid)
			return reply.code(400).send({
				error: "Bad Request",
				message: isValid,
			});

		const hashedPass = await argon2.hash(newPassword, {secret: Buffer.from(process.env.ARGON_SECRET!)});
		const timestamp = await changePassword(server.db, user.id!, hashedPass)

		const tokenData: TokenPayload = {
			id: user.id!,
			username: user.username,
			provider: user.provider,
			provider_id: user.provider_id,
			tfa: Boolean(user.tfa),
			updatedAt: timestamp
		};

		const newToken = await signToken(server, tokenData);

		await setCookie(reply, newToken);

		return reply.status(200).send({ success: true });
	});


}
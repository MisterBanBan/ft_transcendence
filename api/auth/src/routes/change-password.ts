import {FastifyInstance} from "fastify";
import {TokenPayload} from "../interface/token-payload.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import argon2 from "argon2";
import {changeUsername} from "../db/change-username.js";
import {changePassword} from "../db/change-password.js";
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import * as repl from "node:repl";
import {validatePassword} from "../utils/validate-password.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/change-password', async (request, reply) => {
		const { currentPassword, newPassword, confirmNewPassword } = request.body as { currentPassword: string; newPassword: string, confirmNewPassword: string };
		const token = request.cookies.token!;

		const decoded = server.jwt.decode(token) as TokenPayload;

		const user = await getUserByUsername(server.db, decoded.username);
		if (!user) {
			return reply.code(401).send({
				error: "User not found",
				type: "global"
			});
		}

		if (user.provider != "local") {
			return reply.code(401).send({
				error: `Since you are using a different provider (${user.provider}) than transcendence, you can't change your password`,
				type: "global"
			});
		}

		if (!currentPassword || !newPassword || !confirmNewPassword) {
			return reply.code(400).send({
				error: "Current password, new password, and confirm new password are required",
				type: "global"
			});
		}

		if (!await argon2.verify(user.password!, currentPassword, { secret: Buffer.from(process.env.ARGON_SECRET!) })) {
			return reply.code(401).send({
				error: "Invalid password",
				type: "current_password",
			});
		}

		const isValid = await validatePassword(newPassword, confirmNewPassword);
		if (isValid)
			return reply.code(400).send({
				error: isValid,
				type: "new_password",
			});

		const hashedPass = await argon2.hash(newPassword, {secret: Buffer.from(process.env.ARGON_SECRET!)});
		const timestamp = await changePassword(server.db, user.id!, hashedPass)

		const tokenData: TokenPayload = {provider: "local", id: user.id!, username: user.username, updatedAt: timestamp };
		const newToken = await signToken(server, tokenData);

		await setCookie(reply, newToken);

		return reply.status(200).send({ success: true });
	});


}
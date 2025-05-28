import {FastifyInstance} from "fastify";
import {TokenPayload} from "../interface/token-payload.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import argon2 from "argon2";
import {changeUsername} from "../db/change-username.js";
import {changePassword} from "../db/change-password.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/change-password', async (request, reply) => {
		const { currentPassword, newPassword, confirmNewPassword } = request.body as { currentPassword: string; newPassword: string, confirmNewPassword: string };
		const token = request.cookies.token!;

		console.log(currentPassword, newPassword, confirmNewPassword);

		if (!currentPassword || !newPassword || !confirmNewPassword) {
			return reply.code(400).send({ error: "Current password, new password, and confirm new password are required" });
		}

		const decoded = server.jwt.decode(token) as TokenPayload;

		const user = await getUserByUsername(server.db, decoded.username);
		if (!user) {
			return reply.code(401).send({ error: "User not found" });
		}

		if (user.provider != "local") {
			return reply.code(401).send({ error: `Since you are using a different provider (${user.provider}) than transcendence, you can't change your password` });
		}

		if (!await argon2.verify(user.password!, currentPassword, { secret: Buffer.from(process.env.ARGON_SECRET!) })) {
			return reply.code(401).send({ error: "Invalid password" });
		}

		const isValid = validatePassword(newPassword, confirmNewPassword);
		if (isValid)
			return reply.code(400).send({ error: isValid });

		console.log(isValid);

		const hashedPass = await argon2.hash(newPassword, {secret: Buffer.from(process.env.ARGON_SECRET!)});
		const timestamp = await changePassword(server.db, user.id!, hashedPass)

		const tokenData: TokenPayload = {provider: "local", id: user.id!, username: user.username, updatedAt: timestamp };
		const newToken = server.jwt.sign(tokenData, { noTimestamp: true });

		return reply.setCookie('token', newToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 3600
		}).status(200).send({ success: true });
	});

	function validatePassword(password: string, cpassword: string): string[] | null {
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

		return null;
	}
}
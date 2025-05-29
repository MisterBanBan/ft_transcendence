import {FastifyInstance} from "fastify";
import {decodeToken} from "../utils/decode-token.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import argon2 from "argon2";
import {changeUsername} from "../db/change-username.js";
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/change-username', async (request, reply) => {

		const { newUsername, password } = request.body as { newUsername: string; password: string }
		const token = request.cookies.token!;

		if (!newUsername || !password) {
			return reply.code(400).send({ error: "New username and password are required" });
		}

		const decoded = server.jwt.decode(token) as TokenPayload;

		const user = await getUserByUsername(server.db, decoded.username);
		if (!user) {
			return reply.code(401).send({ error: "User not found" });
		}

		if (user.provider != "local") {
			return reply.code(401).send({ error: `Since you are using a different provider (${user.provider}) than transcendence, you can't change your username` });
		}

		if (!await argon2.verify(user.password!, password, { secret: Buffer.from(process.env.ARGON_SECRET!) })) {
			return reply.code(401).send({ error: "Invalid password" });
		}

		if (await getUserByUsername(server.db, newUsername)) {
			return reply.code(401).send({ error: "Username already in use" });
		}

		const regex = /^[a-zA-Z0-9\-]{3,16}$/;
		if (!regex.test(newUsername))
			return reply.code(400).send({ error: "Invalid new username (Must be between 3 and 16 characters, letters and - only)" });

		const timestamp = await changeUsername(server.db, user.id!, newUsername)

		const tokenData: TokenPayload = {provider: "local", id: user.id!, username: newUsername, updatedAt: timestamp };
		const newToken = await signToken(server, tokenData);

		await setCookie(reply, newToken);

		return reply.status(200).send({ success: true });
	});
}
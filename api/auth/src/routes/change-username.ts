import {FastifyInstance} from "fastify";
import {decodeToken} from "../utils/decode-token.js";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import argon2 from "argon2";
import {changeUsername} from "../db/change-username.js";
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import {validateUsername} from "../utils/validate-username.js";

const tempKeys = new Map<number, Date>();

export default async function (server: FastifyInstance) {
	server.post('/api/auth/change-username', async (request, reply) => {

		const { newUsername } = request.body as { newUsername: string; }
		const token = request.cookies.token!;

		const decoded = server.jwt.decode(token) as TokenPayload;

		const user = await getUserByUsername(server.db, decoded.username);
		if (!user) {
			return reply.code(401).send({ error: "User not found." });
		}

		if (user.provider == "42") {
			return reply.code(401).send({ error: `Since you are using 42 as a provider (${user.provider}), you can't change your username.` });
		}

		const key = tempKeys.get(decoded.id);
		const date = await createDate(new Date());

		if (key && key >= date) {
			return reply.code(401).send({ error: "You already changed your username today."});
		}

		if (!newUsername) {
			return reply.code(400).send({ error: "New username is required." });
		}

		if (await getUserByUsername(server.db, newUsername)) {
			return reply.code(401).send({ error: "Username already in use." });
		}

		if (await validateUsername(newUsername)) {
			return reply.code(400).send({error: "Invalid new username (Must be between 3 and 16 characters, letters and - only)."});
		}

		tempKeys.set(decoded.id, await createDate(new Date()));

		const timestamp = await changeUsername(server.db, user.id!, newUsername)

		const tokenData: TokenPayload = {
			provider: "local",
			id: user.id!,
			username: newUsername,
			updatedAt: timestamp
		};

		const newToken = await signToken(server, tokenData);

		await setCookie(reply, newToken);

		return reply.status(200).send({ success: true });
	});

	async function createDate(date: Date): Promise<Date> {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}
}
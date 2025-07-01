import {FastifyInstance, FastifyRequest} from "fastify";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {changeUsername} from "../db/change-username.js";
import {signToken} from "../utils/sign-token.js";
import {setCookie} from "../utils/set-cookie.js";
import {validateUsername} from "../utils/validate-username.js";

const tempKeys = new Map<number, Date>();

export default async function (server: FastifyInstance) {
	server.post('/api/auth/change-username', {
		schema: {
			body: {
				type: "object",
				required: ["newUsername"],
				properties: {
					newUsername: { type: "string", minLength: 3, maxLength: 16 },
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

		const { newUsername } = request.body as { newUsername: string; }
		const token = request.cookies.token!;

		const decoded = server.jwt.decode(token) as TokenPayload;

		const user = await getUserByUsername(server.db, decoded.username);
		if (!user) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found."
			});
		}

		const key = tempKeys.get(decoded.id);
		const date = await createDate(new Date());

		if (key && key >= date) {
			return reply.code(403).send({
				error: "Forbidden",
				message: "You already changed your username today."
			});
		}

		if (await getUserByUsername(server.db, newUsername)) {
			return reply.code(409).send({
				error: "Conflict",
				message: "Username already in use."
			});
		}

		if (!await validateUsername(newUsername)) {
			return reply.code(400).send({
				error: "Bad Request",
				message: "Invalid new username (Must be between 3 and 16 characters, letters and - only)."
			});
		}

		tempKeys.set(decoded.id, await createDate(new Date()));

		const timestamp = await changeUsername(server.db, server.usersDb, user.id!, newUsername)

		const tokenData: TokenPayload = {
			id: user.id!,
			username: newUsername,
			provider: user.provider,
			provider_id: user.provider_id,
			tfa: Boolean(user.tfa),
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
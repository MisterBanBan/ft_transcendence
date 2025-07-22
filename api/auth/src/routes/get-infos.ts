import {FastifyInstance, FastifyRequest} from "fastify";
import {TokenPayload} from "../interface/token-payload.js";
import * as repl from "node:repl";
import {decodeToken} from "../utils/decode-token.js";
import {verifyToken} from "../db/verify-token.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/get-infos', {
		schema: {
			response: {
				200: {
					type: "object",
					required: ["id", "username", "provider", "updated_at"],
					properties: {
						id: { type: "number" },
						username: { type: "string" },
						provider: { type: "string" },
						provider_id: { type: "string" },
						updated_at: { type: "string" },
					},
					additionalProperties: false,
				},
			}
		}
	}, async (request: FastifyRequest, reply) => {
		const authHeader = request.headers.authorization;
		if (!authHeader) {
			return reply.status(403).send({
				error: "Forbidden",
				message: "Missing Authorization header",
			})
		}

		const parts = authHeader.split(' ');
		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			return reply.status(400).send({
				error: "Bad Request",
				message: "Malformed Authorization header"
			});
		}

		const token = parts[1];

		let decodedToken: TokenPayload;
		try {
			decodedToken = server.jwt.verify(token);
			await verifyToken(server.db, decodedToken);
		} catch {
			return reply.status(500).send(undefined);
		}

		if (decodedToken)
			return reply.send(decodedToken);
		else
			return reply.status(400).send(undefined);
	});
}
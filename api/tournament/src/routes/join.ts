import {FastifyInstance, FastifyRequest} from "fastify";
import {Match, Tournament} from "../class/Tournament.js";
import {tournaments} from "./create.js";

export default async function (server: FastifyInstance) {
	server.post('/api/tournament/join', {
		schema: {
			body: {
				type: "object",
				required: ["name", "displayName"],
				properties: {
					name: { type: "string", minLength: 1, maxLength: 16 },
					size: { type: "displayName", minLength: 3, maxLength: 16 },
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

		const { name, displayName } = request.body as {
			name: string,
			displayName: string,
		};

		const currentUser = request.currentUser;
		if (!currentUser) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		const tournament = tournaments.get(name);

		if (!tournament) {
			return reply.status(400).send({
				error: "Bad Request",
				message: `Tournament ${name} does not exist`
			});
		}


		if (tournament.isFull()) {
			return reply.status(400).send({
				error: "Bad Request",
				message: `Tournament ${name} is full`
			});
		}

		if (!/^[a-zA-Z0-9\-]{3,16}$/.test(displayName)) {
			return reply.status(400).send({
				error: "Bad Request",
				message: `Display name is invalid`
			});
		}

		tournament.addPlayer(currentUser.id, displayName);

		return reply.code(200).send({ tournament });
	});
}

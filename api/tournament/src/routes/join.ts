import {FastifyInstance, FastifyRequest} from "fastify";
import {tournaments} from "./create.js";
import {joinTournament} from "../utils/joinTournament.js";

export default async function (server: FastifyInstance) {
	server.post('/api/tournament/join', {
		schema: {
			body: {
				type: "object",
				required: ["name", "displayName"],
				properties: {
					name: { type: "string", minLength: 1, maxLength: 16 },
					displayName: { type: "string", minLength: 3, maxLength: 16 },
				},
				additionalProperties: false,
			},
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

		joinTournament(currentUser.id, displayName, tournament);

		return reply.code(200).send({ message: "Tournament joined successfully" });
	});
}

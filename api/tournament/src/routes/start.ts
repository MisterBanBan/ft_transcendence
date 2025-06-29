import {FastifyInstance, FastifyRequest} from "fastify";
import {tournaments} from "./create.js";
import {joinTournament} from "../utils/joinTournament.js";

export default async function (server: FastifyInstance) {
	server.post('/api/tournament/start', {
		schema: {
			body: {
				type: "object",
				required: ["name"],
				properties: {
					name: { type: "string", minLength: 1, maxLength: 16 },
				},
				additionalProperties: false,
			},
		}
	}, async (request: FastifyRequest, reply) => {

		const { name } = request.body as {
			name: string,
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
			return reply.status(404).send({
				error: "Not Found",
				message: `Tournament ${name} does not exist`
			});
		}

		if (!tournament.hasOwnership(currentUser.id)) {
			return reply.status(403).send({
				error: "403",
				message: `You are not the owner of the tournament`
			});
		}

		if (!tournament.isFull()) {
			return reply.status(403).send({
				error: "403",
				message: `Tournament ${name} is not full`
			});
		}

		return reply.code(200).send({ message: "Tournament started successfully" });
	});
}

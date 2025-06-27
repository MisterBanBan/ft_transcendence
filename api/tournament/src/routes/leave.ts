import {FastifyInstance, FastifyRequest} from "fastify";
import {tournaments} from "./create.js";
import {leaveTournament} from "../utils/leaveTournament.js";

export default async function (server: FastifyInstance) {
	server.post('/api/tournament/leave', {
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


		if (!tournament.hasPlayer(currentUser.id)) {
			return reply.status(400).send({
				error: "Bad Request",
				message: `You are not in the tournament`
			});
		}

		leaveTournament(currentUser.id, tournament);

		return reply.code(200).send({ message: "Tournament left successfully" });
	});
}

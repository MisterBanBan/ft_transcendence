import {FastifyInstance, FastifyRequest} from "fastify";
import {tournaments} from "./create.js";

export default async function (server: FastifyInstance) {
	server.get('/api/tournament/getTournamentInfos', {
		schema: {
			querystring: {
				type: "object",
				required: ["name"],
				properties: {
					name: { type: "string", minLength: 1, maxLength: 16 },
				},
				additionalProperties: false,
			},
		}
	}, async (request: FastifyRequest, reply) => {

		const { name } = request.query as { name: string };

		const currentUser = request.currentUser;
		if (!currentUser) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		const tournament = tournaments.get(name);
		if (!tournament) {
			return reply.code(404).send({
				error: "Not Found",
				message: `Tournament ${name} not found`
			});
		}

		return reply.code(200).send({
			name: name,
			owner: tournament.getOwner(),
			size: tournament.getSize(),
			players: tournament.getPlayers(),
		});
	});
}

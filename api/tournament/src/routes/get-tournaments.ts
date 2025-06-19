import {FastifyInstance, FastifyRequest} from "fastify";
import {tournaments} from "./create.js";

export default async function (server: FastifyInstance) {
	server.get('/api/tournament/getTournaments', async (request: FastifyRequest, reply) => {

		const currentUser = request.currentUser;
		if (!currentUser) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		console.log();

		const tournamentsList: { [key: string]: { size: number; players: number } }[]  = [];
		tournaments.forEach((tournament, name) => {
			tournamentsList.push({
				[name]: {
					"size": tournament.getSize(),
					"players": tournament.getPlayers().size
				}
			})
		});

		return reply.code(200).send(JSON.stringify(tournamentsList));
	});
}

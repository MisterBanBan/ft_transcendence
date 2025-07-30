import {FastifyInstance, FastifyRequest} from "fastify";
import {tournaments} from "../server.js";

export default async function (server: FastifyInstance) {
	server.get('/api/tournament/getTournamentsList', async (request: FastifyRequest, reply) => {

		const user = request.currentUser;
		if (!user) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		type TournamentJSON = { name: string, size: number, registered: number, players: Array<string> };
		const tournamentsList: TournamentJSON[] = [];

		tournaments.forEach((tournament, name) => {
			if (!tournament.hasStarted())
				tournamentsList.push({
					"name": name,
					"size": tournament.getSize(),
					"registered": tournament.getPlayers().size,
					"players": Array.from(tournament.getPlayers().values())
				})
		});

		reply.code(200).send(tournamentsList);
	});
}
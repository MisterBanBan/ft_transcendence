import {FastifyInstance, FastifyRequest} from "fastify";
import {tournaments} from "../server.js";
import {inTournament} from "../utils/in-tournament.js";
import {emitAll} from "../utils/emit-all.js";
import {createStructure} from "../utils/create-structure.js";

export default async function (app: FastifyInstance) {
	app.get('/api/tournament/getTournamentsList', async (request: FastifyRequest, reply) => {

		const user = request.currentUser;
		if (!user) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		type TournamentJSON = { name: string, size: number, registered: number };
		const tournamentsList: TournamentJSON[] = [];

		tournaments.forEach((tournament, name) => {
			if (!tournament.hasStarted())
				tournamentsList.push({
					"name": name,
					"size": tournament.getSize(),
					"registered": tournament.getParticipants().size
				})
		});

		const tournament = await inTournament(user.id)
		if (tournament) {
			const infos = {
				"name": tournament.getName(),
				"size": tournament.getSize(),
				"registered": tournament.getParticipants().size,
				"ownerId": tournament.getOwner(),
				"players": Array.from(tournament.getParticipants()),
				"started": tournament.hasStarted(),
				"structure": createStructure(tournament)
			}

			return reply.code(200).send({ event: "updateTournamentInfos", data: infos });
		}

		return reply.code(200).send({ event: "updateTournamentsList", data: tournamentsList});
	});
}
import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import updateTournamentList from "../socket/updateTournamentList.js";
import {FastifyInstance} from "fastify";

export async function leaveTournament(app: FastifyInstance, playerId: number, tournament: Tournament) {

	tournament.removePlayer(playerId);

	if (tournament.getPlayers().size == 0)
		tournaments.delete(tournament.getName());

	await updateTournamentList(app)
}
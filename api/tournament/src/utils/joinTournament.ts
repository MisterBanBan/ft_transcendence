import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {leaveTournament} from "./leaveTournament.js";
import updateTournamentList from "../socket/updateTournamentList.js";
import {FastifyInstance} from "fastify";

export async function joinTournament(app: FastifyInstance, playerId: number, displayName: string, tournament: Tournament) {

	for (const [ _, tournament ] of tournaments) {
		if (tournament.hasPlayer(playerId)) {
			await leaveTournament(app, playerId, tournament);
			break;
		}
	}

	tournament.addPlayer(playerId, displayName);

	await updateTournamentList(app);
}
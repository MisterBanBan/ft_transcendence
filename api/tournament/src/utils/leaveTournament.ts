import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../routes/create.js";

export function leaveTournament(playerId: number, tournament: Tournament) {

	tournament.removePlayer(playerId);

	if (tournament.getPlayers().size == 0)
		tournaments.delete(tournament.getName());
}
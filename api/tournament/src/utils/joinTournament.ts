import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../routes/create.js";

export function joinTournament(playerId: number, displayName: string, tournament: Tournament) {

	for (const [ _, tournament ] of tournaments) {
		if (tournament.hasPlayer(playerId)) {
			tournament.removePlayer(playerId);
			break;
		}
	}

	tournament.addPlayer(playerId, displayName);
}
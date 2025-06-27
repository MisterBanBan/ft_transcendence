import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../routes/create.js";
import {leaveTournament} from "./leaveTournament.js";

export function joinTournament(playerId: number, displayName: string, tournament: Tournament) {

	for (const [ _, tournament ] of tournaments) {
		if (tournament.hasPlayer(playerId)) {
			leaveTournament(playerId, tournament);
			break;
		}
	}

	tournament.addPlayer(playerId, displayName);
}
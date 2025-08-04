import {tournaments} from "../server.js";
import {Tournament} from "../class/Tournament.js";

export async function inTournament(userId: number): Promise<Tournament | null> {
	for (let [_, tournament] of tournaments) {
		if (tournament.hasPlayer(userId))
			return tournament;
	}

	return null;
}
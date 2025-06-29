import {Match, Tournament} from "../class/Tournament.js";
import {tournaments} from "../routes/create.js";
import {joinTournament} from "../utils/joinTournament.js";

async function createMatchs(matchesNb: number): Promise<Match[]> {
	const matchs: Match[] = [];

	for (let i = 0; i < matchesNb; i++) {
		const match: Match = {
			player1: undefined,
			player2: undefined,
			winner: undefined,
		}

		matchs.push(match);
	}

	return matchs;
}

export async function createTournament(name: string, size: number, currentUserId: number): Promise<Tournament | null> {
	if (tournaments.has(name)) return null;

	if (![4, 8, 16].includes(size)) return null;

	const tournament = new Tournament(name, currentUserId, size);
	joinTournament(currentUserId, "DISPLAY", tournament);

	for (let matchesNb = size / 2; matchesNb > 1; matchesNb /= 2) {
		tournament.getStructure().rounds[matchesNb.toString()] = await createMatchs(matchesNb);
	}
	tournament.getStructure().rounds["1"] = await createMatchs(1);

	tournaments.set(name, tournament);
	return tournament;
}

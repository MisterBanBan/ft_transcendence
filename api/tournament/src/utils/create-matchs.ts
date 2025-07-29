import {Match} from "../class/Tournament.js";

export async function createMatchs(matchesNb: number): Promise<Match[]> {
	const matchs: Match[] = [];

	for (let i = 0; i < matchesNb; i++) {
		const match: Match = new Match()
		matchs.push(match);
	}

	return matchs;
}
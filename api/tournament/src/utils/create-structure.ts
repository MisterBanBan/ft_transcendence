import {Match, Tournament} from "../class/Tournament.js";

interface FrontMatch {
	player1?: number;
	player2?: number;
	winner?: number;
}

interface FrontTournamentStructure {
	rounds: FrontMatch[][];
	winner?: number;
}

export function createStructure(tournament: Tournament) {
	const structure: FrontTournamentStructure = { rounds: [], winner: undefined}
	const tournamentStructure = tournament.getStructure()

	tournamentStructure.rounds.forEach((round: Match[], i: number) => {
		structure.rounds[i] = []
		round.forEach((match: Match, j: number) => {
			structure.rounds[i][j] = {}
			structure.rounds[i][j].player1 = match.getPlayer1();
			structure.rounds[i][j].player2 = match.getPlayer2();
			structure.rounds[i][j].winner = match.getWinner();
		})
	})

	structure.winner = tournamentStructure.winner;

	return structure
}
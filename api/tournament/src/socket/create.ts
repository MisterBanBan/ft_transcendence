import {Match, Tournament, TournamentStructure} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {join} from "./join.js";
import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";
import {createMatchs} from "../utils/create-matchs.js";
import updateTournamentsList from "./update-tournaments-list.js";

function printTournament(tournament: TournamentStructure): void {
	console.log("Tournament Rounds:");
	for (const roundName in tournament.rounds) {
		console.log(`\nRound: ${roundName}`);
		const matches = tournament.rounds[roundName];
		matches.forEach((match: Match, index: number) => {
			const p1 = match.player1 !== undefined ? `Player ${match.player1}` : "Unknown player 1";
			const p2 = match.player2 !== undefined ? `Player ${match.player2}` : "Unknown player 2";
			const winner = match.winner !== undefined ? ` - Winner: Player ${match.winner}` : "";
			console.log(`  Match ${index + 1}: ${p1} vs ${p2}${winner}`);
		});
	}

	if (tournament.winner) {
		console.log(`\nOverall Winner: ${tournament.winner}`);
	} else {
		console.log("\nOverall Winner not yet decided.");
	}
}


export async function create(app: FastifyInstance, socket: Socket, name: string, size: number, displayName: string, ownerId: number): Promise<Tournament | null> {

	if (tournaments.has(name)) return null;

	if (![4, 8, 16].includes(size)) return null;

	const tournament = new Tournament(name, ownerId, size);
	await join(app, ownerId, displayName, tournament);

	for (let round = 1; round < size; round *= 2) {
		const match = size / Math.pow(2, round);
		tournament.getStructure().rounds[round.toString()] = await createMatchs(match);
	}

	printTournament(tournament.getStructure())

	tournaments.set(name, tournament);

	await updateTournamentsList(app);
	return tournament;
}

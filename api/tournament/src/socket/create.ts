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
			const p1 = match.getPlayer1() !== undefined ? `Player ${match.getPlayer1()}` : "Unknown player 1";
			const p2 = match.getPlayer2() !== undefined ? `Player ${match.getPlayer2()}` : "Unknown player 2";
			const winner = match.getWinner() !== undefined ? ` - Winner: Player ${match.getWinner()}` : "";
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

	const tournament = new Tournament(name, ownerId, size);
	await join(app, ownerId, displayName, tournament);

	let index = 0
	for (let round = 1; round < size; round *= 2) {
		const match = size / Math.pow(2, round);
		tournament.getStructure().rounds[index] = await createMatchs(match);
		index++;
	}

	printTournament(tournament.getStructure())

	tournaments.set(name, tournament);

	await updateTournamentsList(app);
	return tournament;
}

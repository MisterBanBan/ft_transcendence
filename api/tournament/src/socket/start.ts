import {FastifyInstance} from "fastify";
import {Match, Tournament} from "../class/Tournament.js";
import {emitAll} from "../utils/emit-all.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";
import {leave} from "./leave.js";
import {tournaments} from "../server.js";

function shuffleMap<K, V>(map: Map<K, V>): Map<K, V> {
	const entries = Array.from(map.entries());

	for (let i = entries.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[entries[i], entries[j]] = [entries[j], entries[i]];
	}

	return new Map(entries);
}

export function wait(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function start(app: FastifyInstance, tournament: Tournament) {

	const players = shuffleMap(tournament.getPlayers())

	const round1 = tournament.getStructure().rounds[0];

	let iteration = 0
	let index = 0
	players.forEach((value, key) => {
		if (iteration % 2 === 0)
			round1[index].setPlayer1(key)
		else {
			round1[index].setPlayer2(key)
			index++;
		}
		iteration++;
	})

	const length = tournament.getStructure().rounds.length;
	for (let i = 0; i < length; i++) {

		const round = tournament.getStructure().rounds[i];

		console.log(round);

		let matchPromises = round.map((match: Match) => {
			return match.startMatch(app, tournament);
		});

		await Promise.all(matchPromises);

		if (i + 1 < length) {
			tournament.getStructure().rounds[i + 1].forEach((match: Match, index: number) => {
				match.setPlayer1(tournament.getStructure().rounds[i][index * 2].getWinner())
				match.setPlayer2(tournament.getStructure().rounds[i][index * 2 + 1].getWinner())
			})

			await wait(5000);

			await updateTournamentInfo(app, 0, tournament, true);
		}
		else {
			console.log("Winner:", round[0].getWinner());
			tournament.getStructure().winner = round[0].getWinner();

			await wait(5000);

			tournament.getPlayers().forEach((name: string, id: number) => {
				leave(app, id, tournament);
			})

			tournaments.delete(tournament.getName());
		}
	}
}
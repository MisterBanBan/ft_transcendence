import {FastifyInstance} from "fastify";
import {Match, Tournament} from "../class/Tournament.js";
import {emitAll} from "../utils/emit-all.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";
import {tournaments} from "../server.js";
import {wait} from "../utils/wait.js";

function shuffleMap<K, V>(map: Map<K, V>): Map<K, V> {
	const entries = Array.from(map.entries());

	for (let i = entries.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[entries[i], entries[j]] = [entries[j], entries[i]];
	}

	return new Map(entries);
}

export async function start(app: FastifyInstance, tournament: Tournament) {

	emitAll(app, 0, "startingTournament", tournament.getName());
	await wait(10000);

	const players = shuffleMap(tournament.getParticipants())

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

		let matchPromises = round.map((match: Match, index: number) => {
			return match.startMatch(app, tournament);
		});

		await Promise.all(matchPromises);

		if (i + 1 < length) {
			tournament.getStructure().rounds[i + 1].forEach((match: Match, index: number) => {
				match.setPlayer1(tournament.getStructure().rounds[i][index * 2].getWinner())
				match.setPlayer2(tournament.getStructure().rounds[i][index * 2 + 1].getWinner())
			})

			emitAll(app, 0, "roundEnded", tournament.getName());

			await wait(2500);

			await updateTournamentInfo(app, 0, tournament, true);

			emitAll(app, 0, "newRound", tournament.getName())

			await wait(5000);
		}
		else {
			const winner = round[0].getWinner()
			tournament.getStructure().winner = winner;

			if (winner)
				emitAll(app, 0, "tournamentEnded", tournament.getName(), tournament.getParticipants().get(winner)?.name);
			else
				emitAll(app, 0, "tournamentEnded", tournament.getName(), "Undefined");

			await wait(2500);

			await updateTournamentInfo(app, 0, tournament, true);

			app.io.socketsLeave(tournament.getName());
			tournaments.delete(tournament.getName());
		}
	}
}
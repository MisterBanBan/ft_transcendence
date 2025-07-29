import {FastifyInstance} from "fastify";
import {Match, Tournament} from "../class/Tournament.js";

function shuffleMap<K, V>(map: Map<K, V>): Map<K, V> {
	const entries = Array.from(map.entries());

	for (let i = entries.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[entries[i], entries[j]] = [entries[j], entries[i]];
	}

	return new Map(entries);
}

export async function start(app: FastifyInstance, tournament: Tournament) {

	if (tournament.isFull())
	{
		console.log("Tournois complet")
		console.log(tournament.getPlayers())
		console.log("----------------------")
	}

	const players = shuffleMap(tournament.getPlayers())

	console.log(players)
	console.log("----------------------")

	const round1 = tournament.getStructure().rounds[0];

	console.log(round1);

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

		let matchPromises = round.map((match: Match) => {
			return match.startMatch();
		});

		await Promise.all(matchPromises);

		tournament.getStructure().rounds[i].forEach(( match: Match, index: number ) => {
			console.log(index, match);
		})

		if (i + 1 < length) {
			tournament.getStructure().rounds[i + 1].forEach((match: Match, index: number) => {
				match.setPlayer1(tournament.getStructure().rounds[i][index * 2].getWinner())
				match.setPlayer2(tournament.getStructure().rounds[i][index * 2 + 1].getWinner())
			})
		}
		else {
			console.log("Winner:", round[0].getWinner());
			// TODO fin de tournois
		}
	}
}
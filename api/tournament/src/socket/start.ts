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

	const round = tournament.getStructure().rounds["1"];

	// round.forEach(( match: Match, index: number ) => {
	// 	console.log(match, index)
	// })

	let iteration = 0
	let index = 0
	players.forEach((value, key) => {
		if (iteration % 2 === 0)
			round[index].player1 = key
		else {
			round[index].player2 = key
			index++;
		}
		iteration++;
	})

	round.forEach(( match: Match, index: number ) => {
		console.log(match, index)
	})
}
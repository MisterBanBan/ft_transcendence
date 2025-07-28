import {FastifyInstance} from "fastify";
import {Match, Tournament} from "../class/Tournament.js";

export async function startTournament(app: FastifyInstance, tournament: Tournament) {

	const players = [...tournament.getPlayers()]
	const round = tournament.getStructure().rounds["1"];

	round.forEach(( match: Match, index: number ) => {
		console.log(match, index)
	})
}
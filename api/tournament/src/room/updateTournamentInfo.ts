import {FastifyInstance} from "fastify";
import {Tournament} from "../class/Tournament.js";

export async function updateTournamentInfo(app: FastifyInstance, tournament: Tournament) {

	const infos = {
		"name": tournament.getName(),
		"size": tournament.getSize(),
		"registered": tournament.getPlayers().size,
		"players": Array.from(tournament.getPlayers().values())
	}

	app.io.to(tournament.getName()).emit("updateTournamentInfos", infos)
}
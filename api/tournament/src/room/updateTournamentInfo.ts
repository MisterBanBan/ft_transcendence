import {FastifyInstance} from "fastify";
import {Tournament} from "../class/Tournament.js";
import {emitAll} from "../utils/emitAll.js";
import {usersSockets} from "../plugins/socket-plugin.js";

export async function updateTournamentInfo(app: FastifyInstance, userId: number, tournament: Tournament) {

	const infos = {
		"name": tournament.getName(),
		"size": tournament.getSize(),
		"registered": tournament.getPlayers().size,
		"players": Array.from(tournament.getPlayers().values())
	}

	emitAll(app, userId, "updateTournamentInfos", infos);
	// app.io.to(tournament.getName()).emit("updateTournamentInfos", infos)
}
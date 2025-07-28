import {FastifyInstance} from "fastify";
import {Tournament} from "../class/Tournament.js";
import {emitAll} from "../utils/emitAll.js";
import {usersSockets} from "../plugins/socket-plugin.js";

export async function updateTournamentInfo(app: FastifyInstance, userId: number, tournament: Tournament, room: boolean) {

	const infos = {
		"name": tournament.getName(),
		"size": tournament.getSize(),
		"registered": tournament.getPlayers().size,
		"players": Array.from(tournament.getPlayers().values())
	}

	if (room)
		emitAll(app, userId, "updateTournamentInfos", tournament.getName(), infos);
	else
		emitAll(app, userId, "updateTournamentInfos", undefined, infos);
	// app.io.to(tournament.getName()).emit("updateTournamentInfos", infos)
}
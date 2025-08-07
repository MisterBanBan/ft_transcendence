import {FastifyInstance} from "fastify";
import {Tournament} from "../class/Tournament.js";
import {emitAll} from "../utils/emit-all.js";
import {createStructure} from "../utils/create-structure.js";

export async function updateTournamentInfo(app: FastifyInstance, userId: number, tournament: Tournament, room: boolean) {

	const infos = {
		"name": tournament.getName(),
		"size": tournament.getSize(),
		"registered": tournament.getParticipants().size,
		"ownerId": tournament.getOwner(),
		"players": Array.from(tournament.getParticipants()),
		"started": tournament.hasStarted(),
		"structure": createStructure(tournament)
	}

	if (room)
		emitAll(app, userId, "updateTournamentInfos", tournament.getName(), infos);
	else
		emitAll(app, userId, "updateTournamentInfos", undefined, infos);
	// app.io.to(tournament.getName()).emit("updateTournamentInfos", infos)
}
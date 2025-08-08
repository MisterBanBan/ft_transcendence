import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {FastifyInstance} from "fastify";
import {allLeaveRoom} from "../utils/all-leave-room.js";
import updateTournamentsList from "./update-tournaments-list.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";

export async function leave(app: FastifyInstance, playerId: number, tournament: Tournament) {

	if (tournament.getOwner() === playerId && tournament.getParticipants().size - 1 > 0) {
		const newOwner = Array.from(tournament.getParticipants())[1][0];
		if (newOwner) {
			tournament.setOwner(newOwner);
		}
	}

	tournament.changeState(playerId, "Left");
	tournament.removePlayer(playerId);

	allLeaveRoom(app, playerId, tournament.getName());

	if (tournament.getParticipants().size == 0)
		tournaments.delete(tournament.getName());

	await updateTournamentInfo(app, playerId, tournament, true);
	await updateTournamentsList(app)
}
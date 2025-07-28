import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";
import {allLeaveRoom} from "../utils/all-leave-room.js";
import updateTournamentsList from "./update-tournaments-list.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";

export async function leave(app: FastifyInstance, socket: Socket, playerId: number, tournament: Tournament) {

	tournament.removePlayer(playerId);
	allLeaveRoom(app, playerId, tournament.getName());

	if (tournament.getPlayers().size == 0)
		tournaments.delete(tournament.getName());

	await updateTournamentInfo(app, playerId, tournament, true);
	await updateTournamentsList(app)
}
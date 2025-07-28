import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import updateTournamentsList from "../socket/updateTournamentsList.js";
import {FastifyInstance} from "fastify";
import {updateTournamentInfo} from "../room/updateTournamentInfo.js";
import {Socket} from "socket.io";
import {allLeaveRoom} from "./allLeaveRoom.js";

export async function leaveTournament(app: FastifyInstance, socket: Socket, playerId: number, tournament: Tournament) {

	tournament.removePlayer(playerId);
	allLeaveRoom(app, playerId, tournament.getName());

	if (tournament.getPlayers().size == 0)
		tournaments.delete(tournament.getName());

	await updateTournamentInfo(app, playerId, tournament, true);
	await updateTournamentsList(app)
}
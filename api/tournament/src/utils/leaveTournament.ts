import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import updateTournamentsList from "../socket/updateTournamentsList.js";
import {FastifyInstance} from "fastify";
import {updateTournamentInfo} from "../room/updateTournamentInfo.js";
import {Socket} from "socket.io";

export async function leaveTournament(app: FastifyInstance, socket: Socket, playerId: number, tournament: Tournament) {

	tournament.removePlayer(playerId);
	socket.leave(tournament.getName());

	if (tournament.getPlayers().size == 0)
		tournaments.delete(tournament.getName());

	await updateTournamentInfo(app, playerId, tournament);
	await updateTournamentsList(app)
}
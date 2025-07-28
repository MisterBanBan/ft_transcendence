import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {leaveTournament} from "./leaveTournament.js";
import updateTournamentsList from "../socket/updateTournamentsList.js";
import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";
import {updateTournamentInfo} from "../room/updateTournamentInfo.js";
import {allJoinRoom} from "./allJoinRoom.js";

export async function joinTournament(app: FastifyInstance, socket: Socket, playerId: number, displayName: string, tournament: Tournament) {

	for (const [ _, tournament ] of tournaments) {
		if (tournament.hasPlayer(playerId)) {
			await leaveTournament(app, socket, playerId, tournament);
			break;
		}
	}

	tournament.addPlayer(playerId, displayName);
	allJoinRoom(app, playerId, tournament.getName());
	// socket.join(tournament.getName());

	await updateTournamentInfo(app, playerId, tournament, true);
	await updateTournamentsList(app);
}
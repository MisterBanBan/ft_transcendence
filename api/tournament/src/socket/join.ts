import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {leave} from "./leave.js";
import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";
import {allJoinRoom} from "../utils/all-join-room.js";
import {updateTournamentInfo} from "../room/updateTournamentInfo.js";
import updateTournamentsList from "./update-tournaments-list.js";

export async function join(app: FastifyInstance, socket: Socket, playerId: number, displayName: string, tournament: Tournament) {

	for (const [ _, tournament ] of tournaments) {
		if (tournament.hasPlayer(playerId)) {
			await leave(app, socket, playerId, tournament);
			break;
		}
	}

	tournament.addPlayer(playerId, displayName);
	allJoinRoom(app, playerId, tournament.getName());

	await updateTournamentInfo(app, playerId, tournament, true);
	await updateTournamentsList(app);
}
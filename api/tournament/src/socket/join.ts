import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {leave} from "./leave.js";
import {FastifyInstance} from "fastify";
import {allJoinRoom} from "../utils/all-join-room.js";
import updateTournamentsList from "./update-tournaments-list.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";

export async function join(app: FastifyInstance, playerId: number, displayName: string, tournament: Tournament) {

	for (const [ _, tournament ] of tournaments) {
		if (tournament.hasPlayer(playerId)) {
			await leave(app, playerId, tournament);
			break;
		}
	}

	tournament.addPlayer(playerId, displayName);
	allJoinRoom(app, playerId, tournament.getName());

	await updateTournamentInfo(app, playerId, tournament, true);
	await updateTournamentsList(app);
}
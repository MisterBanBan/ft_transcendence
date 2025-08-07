import {Tournament} from "../class/Tournament.js";
import {tournaments} from "../server.js";
import {join} from "./join.js";
import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";
import {createMatchs} from "../utils/create-matchs.js";
import updateTournamentsList from "./update-tournaments-list.js";

export async function create(app: FastifyInstance, socket: Socket, name: string, size: number, displayName: string, ownerId: number): Promise<Tournament | null> {

	const tournament = new Tournament(app, name, ownerId, size);
	await join(app, ownerId, displayName, tournament);

	let index = 0
	for (let round = 1; round < size; round *= 2) {
		const match = size / Math.pow(2, round);
		tournament.getStructure().rounds[index] = await createMatchs(match);
		index++;
	}

	tournaments.set(name, tournament);

	await updateTournamentsList(app);
	return tournament;
}

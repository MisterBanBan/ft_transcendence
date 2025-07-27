import {tournaments} from "../routes/create.js";
import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";

type Tournament = { name: string, size: number, players: number }[];

export default async function updateTournamentList(app: FastifyInstance, socket?: Socket) {
	const tournamentsList: Tournament = [];
	tournaments.forEach((tournament, name) => {
		tournamentsList.push({
			"name": name,
			"size": tournament.getSize(),
			"players": tournament.getPlayers().size
		})
	});

	if (socket)
		socket.emit("updateTournamentList", tournamentsList);
	else
		app.io.sockets.sockets.forEach((socket: Socket) => {
			socket.emit("updateTournamentList", tournamentsList);
		})
}

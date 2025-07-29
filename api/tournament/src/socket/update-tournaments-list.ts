import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";
import { tournaments } from "../server.js"

type Tournament = { name: string, size: number, registered: number, players: Array<string> };

export default async function updateTournamentsList(app: FastifyInstance, socket?: Socket) {
	const tournamentsList: Tournament[] = [];

	tournaments.forEach((tournament, name) => {
		if (!tournament.hasStarted())
			tournamentsList.push({
				"name": name,
				"size": tournament.getSize(),
				"registered": tournament.getPlayers().size,
				"players": Array.from(tournament.getPlayers().values())
			})
	});

	if (socket)
		socket.emit("updateTournamentsList", tournamentsList);
	else
		app.io.sockets.sockets.forEach((appSocket: Socket) => {
			appSocket.emit("updateTournamentsList", tournamentsList);
		})
}

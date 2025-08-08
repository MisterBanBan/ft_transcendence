import {FastifyInstance} from "fastify";
import {Socket} from "socket.io";
import { tournaments } from "../server.js"

type TournamentJSON = { name: string, size: number, registered: number };

export default async function updateTournamentsList(app: FastifyInstance, socket?: Socket) {
	let tournamentsList: TournamentJSON[] = []

	tournaments.forEach((tournament, name) => {
		if (!tournament.hasStarted())
			tournamentsList.push({
				"name": name,
				"size": tournament.getSize(),
				"registered": tournament.getParticipants().size
			})
	});

	if (socket) {
		if (socket.rooms.size === 1)
			socket.emit("updateTournamentsList", tournamentsList);
	}
	else
		app.io.sockets.sockets.forEach((appSocket: Socket) => {
			if (appSocket.rooms.size === 1)
				appSocket.emit("updateTournamentsList", tournamentsList);
		})
}

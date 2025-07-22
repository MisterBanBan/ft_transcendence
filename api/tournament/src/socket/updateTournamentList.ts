import {tournaments} from "../routes/create.js";
import {activeSockets} from "../wss.js";

export function updateTournamentList() {

	const tournamentsList: { [key: string]: { size: number; players: number } }[]  = [];
	tournaments.forEach((tournament, name) => {
		tournamentsList.push({
			[name]: {
				"size": tournament.getSize(),
				"players": tournament.getPlayers().size
			}
		})
	});

	activeSockets.forEach(async (socket) => {
		socket.send(JSON.stringify({ "type": "tournamentsList", tournaments: tournamentsList }))
	});
}
import {FastifyInstance, FastifyRequest} from "fastify";
import {WebSocket} from "@fastify/websocket";
import { createTournament } from "./socket/createTournament";
import {updateTournamentList} from "./socket/updateTournamentList.js";
import {tournaments} from "./routes/create.js";
import {leaveTournament} from "./utils/leaveTournament.js";
import {joinTournament} from "./utils/joinTournament.js";

export const activeSockets = new Map<number, WebSocket>

export default async function (server: FastifyInstance) {
	server.get('/wss/tournament', {
		websocket: true
	}, (socket: WebSocket, request: FastifyRequest) => {

		try {
			if (!socket)
				console.error("Socket not found");
			console.log('Client connected');

			const { user } = request.query as { user?: string };
			if (!user) {
				socket.send("You are not logged in");
				socket.close();
				return;
			}

			request.currentUser = JSON.parse(Buffer.from(user, 'base64').toString());
			if (!request.currentUser) {
				socket.send("Error while getting the user");
				socket.close();
				return;
			}

			activeSockets.set(request.currentUser.id, socket);

			socket.send(JSON.stringify({
				type: 'welcome',
				message: 'WebSocket connexion established',
				timestamp: new Date().toISOString()
			}));

			updateTournamentList();

			socket.on("message", (message: string | Buffer) => {
				let data;
				try {
					data = JSON.parse(message.toString());
				} catch {
					console.error(data, "is not a JSON object");
					return;
				}

				console.log(data);

				if (!data.action)
				{
					socket.send("Websocket object must be { action: string, infos: {} }")
					return;
				}

				switch (data.action) {
					case "createTournament": {
						if (!data.infos?.name || !data.infos?.size)
							return;
						if (createTournament(data.infos.name, data.infos.size, request.currentUser!.id) === null)
							console.error("An error occurred while creating a tournament");
						break;
					}
					case "joinTournament": {
						if (!data.infos?.name || !data.infos?.displayName)
							return;
						const tournament = tournaments.get(data.infos.name);
						if (!tournament)
							return;
						joinTournament(request.currentUser!.id, data.infos.displayName, tournament)
						break;
					}
				}
			});

			socket.on("close", () => {
				for (const [ _, tournament ] of tournaments) {
					if (tournament.hasPlayer(request.currentUser!.id)) {
						leaveTournament(request.currentUser!.id, tournament);
						break;
					}
				}
				console.log("Client disconnected");
			});
		} catch (e) {
			console.log("Error in the websocket:", e);
		}
	});
};
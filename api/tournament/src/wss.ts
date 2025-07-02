import {FastifyInstance, FastifyRequest} from "fastify";
import {WebSocket} from "@fastify/websocket";
import { createTournament } from "./socket/createTournament";

export default async function (server: FastifyInstance) {
	console.log("Register route")
	server.get('/wss/tournament', {
		websocket: true
	}, (socket: WebSocket, request: FastifyRequest) => {

		console.log("Test");
		try {
			if (!socket)
				console.error("Socket not found");
			console.log('Client connected');

			socket.send(JSON.stringify({
				type: 'welcome',
				message: 'WebSocket connexion established',
				timestamp: new Date().toISOString()
			}));

			socket.on("message", (message: string | Buffer) => {
				let data;
				try {
					data = JSON.parse(message.toString());
				} catch {
					console.error(data, "is not a JSON object");
					return;
				}

				if (!data.action)
					return;

				switch (data.action) {
					case "createTournament": {
						if (!data.infos?.name || !data.infos?.size)
							return;
						createTournament(data.infos.name, data.infos.size, 20); break;
					}
					case "joinTournament": {
						console.log("joinTournament", data.infos); break;
						// TODO join tournament logic
					}
				}
			});

			socket.on("close", () => {
				console.log("Client disconnected");
			});
		} catch (e) {
			console.log("Error in the websocket:", e);
		}
	});
};
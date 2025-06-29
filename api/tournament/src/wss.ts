import {FastifyInstance, FastifyRequest} from "fastify";
import {WebSocket} from "@fastify/websocket";

export default async function (server: FastifyInstance) {
	server.get('/wss/tournament', {
		websocket: true
	}, (socket: WebSocket, request: FastifyRequest) => {

		try {
			if (!socket)
				console.error("Socket not found");
			console.log('Nouveau client connecté');

			socket.send(JSON.stringify({
				type: 'welcome',
				message: 'WebSocket connexion established',
				timestamp: new Date().toISOString()
			}));

			socket.on("message", (message: string | Buffer) => {
				console.log("Message reçu:", message.toString());
				socket.send("Hello from server!");
			});

			socket.on("close", () => {
				console.log("Client disconnected");
			});
		} catch (e) {
			console.log("Error in the websocket:", e);
		}
	});
};
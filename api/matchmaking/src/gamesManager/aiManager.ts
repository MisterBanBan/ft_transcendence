import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { io as ClientIO } from "socket.io-client";

const aiSocket = ClientIO("http://ai:8085", {
    transports: ["websocket"],
  });

export function aiManager(socket: Socket, app: FastifyInstance) {
	const gameSocket = app.gameSocket;
	const gameId = `game-${socket.id}`;
	app.playerToGame.set(socket.id, gameId);

	gameSocket.emit("create-game", {
		gameId,
		playerIds: [aiSocket.id, socket.id],
	});

	aiSocket.emit("game-started", {
		gameId,
		playerId: aiSocket.id,
    });

	socket.emit("game-started", {
		gameId,
		playerId: socket.id,
	});

	socket.on("player-input", (data) => {
		const gameId = app.playerToGame.get(socket.id);
		if (!gameId) return;

	gameSocket.emit("player-input", {
		gameId,
		playerId: socket.id,
		input: data,
	});
	});

	socket.on("disconnect", () => {
	app.log.info(`Client disconnected: ${socket.id}`);

    app.playerToGame.delete(socket.id);
  });
}

import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";

export function localManager(socket: Socket, app: FastifyInstance) {
	const gameSocket = app.gameSocket;
	const gameId = `game-${socket.id}`;

	app.playerToGame.set(socket.id, { playerName: "local", gameId: gameId, side: "undefined" });

    gameSocket.emit("create-game", {
      gameId,
      playerIds: [socket.id],
    });

    socket.emit("game-started", {
      gameId,
      playerId: socket.id,
    });

	socket.on("player-input", (data) => {
	const value = app.playerToGame.get(socket.id);
		if (!value?.gameId) return;

	gameSocket.emit("player-input", {
		gameId: value.gameId,
		playerId: socket.id,
		input: data,
	});
	});

	socket.on("disconnect", () => {
	app.log.info(`Client disconnected: ${socket.id}`);

	app.playerToGame.delete(socket.id);
	});
}

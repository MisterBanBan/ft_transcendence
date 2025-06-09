import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";

let waitingPlayer: Socket | null = null;

export function onlineManager(socket: Socket, app: FastifyInstance) {
  const gameSocket = app.gameSocket;

	if (!waitingPlayer) {
		waitingPlayer = socket;
	} else {
		const gameId = `game-${waitingPlayer.id}${socket.id}`;

		app.playerToGame.set(socket.id, gameId);
		app.playerToGame.set(waitingPlayer.id, gameId);

		gameSocket.emit("create-game", {
			gameId,
			playerIds: [waitingPlayer.id, socket.id],
		});

		waitingPlayer.emit("game-started", {
			gameId,
			playerId: waitingPlayer.id,
		});

		socket.emit("game-started", {
			gameId,
			playerId: socket.id,
		});

		waitingPlayer = null;
	}

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

	if (waitingPlayer?.id === socket.id) {
		waitingPlayer = null;
	}

	app.playerToGame.delete(socket.id); // remove for reconnect on a game
  });
}

import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";

export function localManager(socket: Socket, app: FastifyInstance, userID: string) {
	const gameSocket = app.gameSocket;
	const gameId = `game-${socket.id}`;

	app.playerToGame.set(socket.id, { userID: userID, gameId: gameId, side: "undefined", type: "local" });

    gameSocket.emit("create-game", {
      gameId,
      playerIds: [socket.id],
    });

    socket.emit("game-started", {
      gameId,
      side: "undefined",
    });

	app.usersSocket.emit("newGame", {playerID: userID});

	console.log(gameId, "started");

	socket.on("player-input", (data: any) => {
	const value = app.playerToGame.get(socket.id);
	if (!value)
		return;
	if (!value?.gameId) return;

	gameSocket.emit("player-input", {
		gameId: value.gameId,
		playerId: socket.id,
		input: data,
	});
	});

	socket.on("abandon", () => {
		const value = app.playerToGame.get(socket.id);
		if (!value?.gameId) return;

		
		gameSocket.emit("abandon", {
			gameId,
			playerId: socket.id,
			side: value.side,
		});
	});

	socket.on("disconnect", () => {
	console.log("Client disconnected:", socket.id);
	});
}

import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";

let privateWaiting = new Map<string, string>();

export function privateManager(socket: Socket, app: FastifyInstance) {
	// const gameSocket = app.gameSocket;

	// if (!waitingPlayer) {
	// 	waitingPlayer = socket;
	// } else {
	// 	const gameId = `game-${waitingPlayer.id}${socket.id}`;

	// 	app.playerToGame.set(socket.id, { playerName: "Michel", gameId: gameId, side: "left" }); // remplacer par les noms des users
	// 	app.playerToGame.set(waitingPlayer.id, { playerName: "Michel", gameId: gameId, side: "right" });

	// 	gameSocket.emit("create-game", {
	// 		gameId,
	// 		playerIds: [waitingPlayer.id, socket.id],
	// 	});

	// 	waitingPlayer.emit("game-started", {
	// 		gameId,
	// 		playerId: waitingPlayer.id,
	// 	});

	// 	socket.emit("game-started", {
	// 		gameId,
	// 		playerId: socket.id,
	// 	});

	// 	console.log(gameId, "started");

	// 	waitingPlayer = null;
	// }

	// socket.on("player-input", (data: { direction: string, state: boolean, player: string}) => {
	// const value = app.playerToGame.get(socket.id);
	// data.player = value!.side;
	// if (!value?.gameId) return;

	// gameSocket.emit("player-input", {
	// 	gameId: value.gameId,
	// 	playerId: socket.id,
	// 	input: data,
	// });
	// });

	// socket.on("disconnect", () => {
	// 	console.log("Client disconnected:", socket.id);

	// 	if (waitingPlayer?.id === socket.id) {
	// 		waitingPlayer = null;
	// 	}

	// 	app.playerToGame.delete(socket.id); // remove for reconnect on a game
  	// });
}

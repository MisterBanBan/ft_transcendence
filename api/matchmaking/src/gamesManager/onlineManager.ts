import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { waitingUser } from "../utils/interface";
import { inputData } from "../utils/interface";

let waitingPlayer: waitingUser | null = null;

export function onlineManager(socket: Socket, app: FastifyInstance, userID: string) {
	const gameSocket = app.gameSocket;

	if (!waitingPlayer) {
		waitingPlayer = {socket, userID};
	} else if (waitingPlayer.userID !== userID) {
		const gameId = `game-${waitingPlayer.socket.id}${socket.id}`;

		app.playerToGame.set(socket.id, { userID: userID, gameId: gameId, side: "left" , type: "online" });
		app.playerToGame.set(waitingPlayer.socket.id, { userID: waitingPlayer.userID, gameId: gameId, side: "right", type: "online" });

		gameSocket.emit("create-game", {
			gameId,
			playerIds: [waitingPlayer.socket.id, socket.id],
		});

		waitingPlayer.socket.emit("game-started", {
			gameId,
			side: "right"
		});

		socket.emit("game-started", {
			gameId,
			side: "left",
		});

		app.usersSocket.emit("newGame", {playerID: userID});
		app.usersSocket.emit("newGame", {playerID: waitingPlayer.userID});

		console.log(gameId, "started");

		waitingPlayer = null;
	}

	socket.on("player-input", (data: inputData) => {
	const value = app.playerToGame.get(socket.id);
	if (!value)
		return;
	data.player = value!.side;
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
			gameId: value.gameId,
			playerId: socket.id,
			side: value.side,
		});
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected:", socket.id);

		if (waitingPlayer?.socket.id === socket.id) {
			waitingPlayer = null;
		}
  	});
}

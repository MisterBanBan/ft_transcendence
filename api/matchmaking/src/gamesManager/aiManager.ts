import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { inputData } from "../utils/interface";

export function aiManager(socket: Socket, app: FastifyInstance, userID: string) {
	const gameSocket = app.gameSocket;
	const gameId = `game-${socket.id}`;
	app.playerToGame.set(socket.id, { userID: userID, gameId: gameId, side: "left", type: "ai" });
	app.playerToGame.set(app.aiSocket.id, { userID: "AI", gameId: gameId, side: "right", type: "ai" });

	gameSocket.emit("create-game", {
		gameId,
		playerIds: [app.aiSocket.id, socket.id],
	});

	app.aiSocket.emit("game-started", {
		gameId,
		side: "right",
    });

	socket.emit("game-started", {
		gameId,
		side: "left",
	});

	app.usersSocket.emit("newGame", {playerID: userID});

	console.log(gameId, "started");

	socket.on("player-input", (data: inputData) => {
		const value = app.playerToGame.get(socket.id);
		if (!value)
			return;
		data.player = value!.side;
		if (!value?.gameId) return;

		
		gameSocket.emit("player-input", {
			gameId,
			playerId: socket.id,
			input: data,
		});
	});

	app.aiSocket.on("player-input", (data : any) => {
		gameSocket.emit("player-input", {
			gameId: data.gameId,
			playerId: app.aiSocket.id,
			input: data.input,
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

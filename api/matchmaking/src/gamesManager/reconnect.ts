import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { playerInfo } from "../utils/interface";
import { inputData } from "../utils/interface";

export function reconnect(socket: Socket, app: FastifyInstance, userID: string, oldPlayer: playerInfo)
{
	app.playerToGame.set(socket.id, { userID: userID, gameId: oldPlayer.gameId, side: oldPlayer.side, type: oldPlayer.type });
	socket.emit("game-started", {
		gameId: oldPlayer.gameId,
		side: oldPlayer.side,
	});

	const gameSocket = app.gameSocket;

	socket.on("player-input", (data: inputData) => {
	const value = app.playerToGame.get(socket.id);
	if (!value)
		return;
	if (value!.side !== "undefined")
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
}
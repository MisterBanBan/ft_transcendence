import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { inputData } from "../utils/interface";

let privateWaiting = new Map<string, Socket>();

export function privateManager(socket: Socket, app: FastifyInstance, userID: string) {
	const gameSocket = app.gameSocket;

	let opponent: string | null = null;
	for (const [player, opp] of app.privateQueue.entries()) {
		if (userID === player)
		{
			opponent = opp;
			break ;
		}
	}

	if (opponent === null)
		return;

	let findOpp: boolean = false;
	for (const [oppID, oppSocket] of privateWaiting.entries()) {
		if (oppID === opponent)
		{
			findOpp = true;

			const gameId = `game-${oppSocket.id}${socket.id}`;
			app.playerToGame.set(socket.id, { userID: userID, gameId: gameId, side: "left" });
			app.playerToGame.set(oppSocket.id, { userID: oppID, gameId: gameId, side: "right" });

			gameSocket.emit("create-game", {
				gameId,
				playerIds: [oppSocket.id, socket.id],
			});

			oppSocket.emit("game-started", {
				gameId,
				playerId: oppSocket.id,
			});

			socket.emit("game-started", {
				gameId,
				playerId: socket.id,
			});

			privateWaiting.delete(oppID);
			console.log(gameId, "started");
		}
	}

	if (findOpp == false)
	{
		privateWaiting.set(userID, socket);
	}

	socket.on("player-input", (data: inputData) => {
	const value = app.playerToGame.get(socket.id);
	data.player = value!.side;
	if (!value?.gameId) return;

	gameSocket.emit("player-input", {
		gameId: value.gameId,
		playerId: socket.id,
		input: data,
	});
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected:", socket.id);

		for (const [oppID, oppSocket] of privateWaiting.entries()) {
			if (oppSocket.id === socket.id)
			{
				privateWaiting.delete(oppID);
			}
		}

  	});
}

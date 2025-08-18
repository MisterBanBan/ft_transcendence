import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { inputData, privateInfo } from "../utils/interface";

let privateWaiting = new Map<string, Socket>();

export function privateManager(socket: Socket, app: FastifyInstance, userID: string) {
	const gameSocket = app.gameSocket;

	let opponent: string | null = null;
	let type: string = "private";
	for (const [player, info] of app.privateQueue.entries()) {
		if (userID === player)
		{
			opponent = info.opponent;
			type = info.type;
			app.privateQueue.delete(userID);
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
			app.playerToGame.set(socket.id, { userID: userID, gameId: gameId, side: "left", type});
			app.playerToGame.set(oppSocket.id, { userID: oppID, gameId: gameId, side: "right", type});

			gameSocket.emit("create-game", {
				gameId,
				playerIds: [oppSocket.id, socket.id],
			});

			oppSocket.emit("game-started", {
				gameId,
				side: "right",
			});

			socket.emit("game-started", {
				gameId,
				side: "left",
			});

			app.usersSocket.emit("newGame", {playerID: userID});
			app.usersSocket.emit("newGame", {playerID: oppID});

			privateWaiting.delete(oppID);
			console.log(gameId, "started with type : ", type)	;
		}
	}

	if (findOpp == false)
	{
		privateWaiting.set(userID, socket);
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

		for (const [oppID, oppSocket] of privateWaiting.entries()) {
			if (oppSocket.id === socket.id)
			{
				privateWaiting.delete(oppID);
			}
		}

  	});
}

import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";

export function aiManager(socket: Socket, app: FastifyInstance) {
	const gameSocket = app.gameSocket;
	const gameId = `game-${socket.id}`;
	app.playerToGame.set(socket.id, { playerName: "player", gameId: gameId, side: "left" });
	app.playerToGame.set(app.aiSocket.id, { playerName: "AI", gameId: gameId, side: "right" });

	gameSocket.emit("create-game", {
		gameId,
		playerIds: [app.aiSocket.id, socket.id],
	});

	app.aiSocket.emit("game-started", {
		gameId,
		playerId: app.aiSocket.id,
    });

	socket.emit("game-started", {
		gameId,
		playerId: socket.id,
	});

	socket.on("player-input", (data: { direction: string, state: boolean, player: string}) => {
		const value = app.playerToGame.get(socket.id);
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
	
	socket.on("disconnect", () => {
	app.log.info(`Client disconnected: ${socket.id}`);

    app.playerToGame.delete(socket.id);
  });
}

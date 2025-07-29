import { FastifyInstance } from "fastify";


export function gameUpdate(app: FastifyInstance){

	app.gameSocket.on("connect", () => {
		console.log("Connected to game service");
	});

	app.gameSocket.on("game-update", (data:  { gameId: string, state: any}) => {
		const gameId = data.gameId;

		for (const [playerId, value] of app.playerToGame.entries()) {
			const pGameId = value.gameId;
			if (pGameId === gameId) {
				const clientSocket = app.io.sockets.sockets.get(playerId);
				if (clientSocket) {
					clientSocket.emit("game-update", data);
				}
				if (playerId === app.aiSocket.id) {
					app.aiSocket.emit("game-update", data);
				}
			}
		}
	});

	app.gameSocket.on("game-end", (data: {gameId: string, score: { playerLeft: number, playerRight: number }}) => {
		console.log("game", data.gameId, "end with a score of", data.score.playerLeft, ":", data.score.playerRight);
		for (const [playerId, value] of app.playerToGame.entries()) {
			const pGameId = value.gameId;
			if (pGameId === data.gameId) {
				const clientSocket = app.io.sockets.sockets.get(playerId);
				if (clientSocket) {
					clientSocket.emit("game-end", data.score);
					while(app.playerToGame.delete(playerId));
				}
				if (playerId === app.aiSocket.id) {
					app.aiSocket.emit("game-end", data.gameId);
				}
			}
		}
	})
}
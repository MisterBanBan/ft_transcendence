import { FastifyInstance } from "fastify";
import { playerInfo } from "../utils/interface";


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

		const toDelete: string[] = [];
		let   privateResult: playerInfo[] | null = null;
		for (const [playerId, value] of app.playerToGame.entries()) {
    		if (value.gameId === data.gameId) {
        		const clientSocket = app.io.sockets.sockets.get(playerId);
        		if (clientSocket) {
            		clientSocket.emit("game-end", data.score);
        		}
        		if (playerId === app.aiSocket.id) {
					app.aiSocket.emit("game-end", data.gameId);
				}
				toDelete.push(playerId);
				if (value.type === "tournament" || value.type === "friend") {
					if (!privateResult) {
						privateResult = [];
					}
					if (!privateResult.includes(value))
						privateResult.push(value);
				}
    		}
		}
		for (const playerId of toDelete) {
			app.playerToGame.delete(playerId);
			console.log(playerId, "disconnected from game", data.gameId);
		}
		if (privateResult && privateResult.length == 2) {
			if (data.score.playerLeft > data.score.playerRight && privateResult[0].side === "left" ||
				data.score.playerLeft < data.score.playerRight && privateResult[0].side === "right") {
				app.privateResult.set(privateResult[0].userID, {opponent: privateResult[1].userID, type: privateResult[0].type});
			} else {
				app.privateResult.set(privateResult[1].userID, {opponent: privateResult[0].userID, type: privateResult[0].type});
			}
			console.log("Private game result for game", data.gameId, ":", privateResult);
		}
	})
}
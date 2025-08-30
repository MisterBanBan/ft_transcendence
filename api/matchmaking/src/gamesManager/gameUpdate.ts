import { FastifyInstance } from "fastify";
import { playerInfo, EndMatchBody } from "../utils/interface";
import { savMatchStats } from "../savData/savMatch";


export function gameUpdate(app: FastifyInstance){

	app.gameSocket.on("connect", () => {
		console.log("Connected to game service");
	});

	app.gameSocket.on("game-update", (data:  { gameId: string, state: any, time: number}) => {
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

		const	toDelete: string[] = [];
		let		result: playerInfo[] | null = null;
		let		type: string | undefined = undefined;
		for (const [playerId, value] of app.playerToGame.entries()) {
    		if (value.gameId === data.gameId) {
				type = value.type;
        		const clientSocket = app.io.sockets.sockets.get(playerId);
        		if (clientSocket) {
            		clientSocket.emit("game-end", data.score);
        		}
        		if (playerId === app.aiSocket.id) {
					app.aiSocket.emit("game-end", data.gameId);
				}
				toDelete.push(playerId);
				if ((value.type === "tournament" || value.type === "friend") || value.type === "online") {
					if (!result) {
						result = [];
					}
					if (!result.includes(value))
						result.push(value);
				}
    		}	
		}
		for (const playerId of toDelete) {
			if (app.playerToGame.get(playerId)?.userID != "AI")
				app.usersSocket.emit("endGame", {playerID: app.playerToGame.get(playerId)?.userID});
			app.playerToGame.delete(playerId);
			console.log(playerId, "disconnected from game", data.gameId);
		}
		let winner: number | undefined = undefined;
		let looser: number | undefined = undefined;
		let rightScore: number | undefined = undefined;
		let leftScore: number | undefined = undefined;
		if (result && result.length == 2) {
			rightScore = data.score.playerRight;
			leftScore = data.score.playerLeft;
			if (leftScore > rightScore && result[0].side === "left" ||
				leftScore < rightScore && result[0].side === "right") {
				winner = 0;
				looser = 1;
			} else {
				winner = 1;
				looser = 0;
			}
		}
		if (type == "tournament" && winner !== undefined && looser !== undefined && result && result.length >= 2)
		{
			app.privateResult.set(result[winner].userID, {opponent: result[looser].userID, type: result[winner].type});
			console.log("Private game result for game", data.gameId, ":", result);
		}
		if ((type == "tournament" || type == "online") && rightScore !== undefined && leftScore !== undefined && winner !== undefined && looser !== undefined && result && result.length >= 2)
		{
			savMatchStats(app, { player1_id: result[0].userID, player2_id: result[1].userID, winner_id: result[winner].userID, player1_score: leftScore, player2_score: rightScore, game_type: type});
		}
	})
}
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { localManager } from "../gamesManager/localManager";
import { onlineManager } from "../gamesManager/onlineManager";
import { aiManager } from "../gamesManager/aiManager";
import { privateManager } from "../gamesManager/privateManager";
import { reconnect } from "../gamesManager/reconnect";
import { Socket } from "socket.io";

const socketPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.io.on("connection", (socket: Socket) => {

		const user: string | undefined | string[] = socket.handshake.query.user;
		let	userID: string | null = null;

		if (typeof user === 'string') {
			try {
				const jsonStr = Buffer.from(user, 'base64').toString();
				const obj = JSON.parse(jsonStr);
				userID = obj.id.toString();
			} catch (e) {
				console.error('User header could not be parsed:', e);
			}
		} else {
			console.error('No valid user in handshake');
		}

		if (userID == null)
		{
			console.error('User not valid');
			return;
		}
		for (const [socketId, value] of app.playerToGame.entries()) {
			const connectedUser = value.userID;
			if (connectedUser === userID) {
				reconnect(socket, app, userID, value);
				// app.playerToGame.delete(socketId);
				return;
			}
		}

		socket.on("local", () => {
			if (!(app.playerToGame.has(socket.id)))
				localManager(socket, app, userID);
		})

		socket.on("online", () => {
			if (!(app.playerToGame.has(socket.id)))
				onlineManager(socket, app, userID);
		})

		socket.on("ai", () => {
			if (!(app.playerToGame.has(socket.id)))
				aiManager(socket, app, userID);
		})

		socket.on("private", () => {
			if (!(app.playerToGame.has(socket.id)))
				privateManager(socket, app, userID);
		})
	});
};

export default socketPlugin;

import { FastifyPluginAsync } from "fastify";
import { localManager } from "../gamesManager/localManager";
import { onlineManager } from "../gamesManager/onlineManager";
import { aiManager } from "../gamesManager/aiManager";
import { privateManager } from "../gamesManager/privateManager";
import { Socket } from "socket.io";

const socketPlugin: FastifyPluginAsync = async (app) => {
	app.io.on("connection", (socket: Socket) => {
	console.log("Client connected:", socket.id);
    
    socket.on("local", () => {
		if (!(app.playerToGame.has(socket.id)))
			localManager(socket, app);
	})

	socket.on("online", () => {
		if (!(app.playerToGame.has(socket.id)))
			onlineManager(socket, app);
	})

	socket.on("ai", () => {
		if (!(app.playerToGame.has(socket.id)))
			aiManager(socket, app);
	})

	socket.on("private", () => {
		if (!(app.playerToGame.has(socket.id)))
			privateManager(socket, app);
	})
	});
};

export default socketPlugin;

import {FastifyInstance} from "fastify";
import {usersSockets} from "../plugins/socket-plugin.js";

export function emitAll(app: FastifyInstance, userId: number, eventName: string, room?: string, ...data: any[]) {

	if (room) {
		app.io.to(room).emit(eventName, ...data)
		return;
	}

	const sockets = usersSockets.get(userId)
	if (sockets) {
		sockets.forEach((socketId) => {
			const socket = app.io.sockets.sockets.get(socketId)
			if (socket)
				socket.emit(eventName, ...data);
		})
	}
}
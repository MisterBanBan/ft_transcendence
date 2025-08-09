import {FastifyInstance} from "fastify";
import {usersSockets} from "../plugins/socket-plugin.js";

export function allLeaveRoom(app: FastifyInstance, userId: number, roomName: string) {

	const sockets = usersSockets.get(userId);

	if (sockets) {
		for (let socketId of sockets) {

			const socket = app.io.sockets.sockets.get(socketId);
			if (socket) {
				socket.leave(roomName)
			} else {
				sockets.delete(socketId)
			}
		}
	}
}
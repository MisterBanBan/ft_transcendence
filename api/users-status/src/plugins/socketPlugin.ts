import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import { updateUserStatus } from "./insertToDB";

const socketPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.io.on("connection", (socket: Socket) => {
		// console.log("Client connected:", socket.id);

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

		updateUserStatus(app, userID, "online");

		socket.on("disconnect", () => {
			updateUserStatus(app, userID, "offline");
		});
	});
};

export default socketPlugin;

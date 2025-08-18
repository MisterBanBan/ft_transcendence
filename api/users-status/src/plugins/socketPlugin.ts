import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import { updateUserStatus } from "./insertToDB";


const socketPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.io.on("connection", (socket: Socket) => {
		//console.log("Client connected:", socket.id);

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
		}
		if (userID == null)
		{
			socket.on("newGame", (playerID: any) => {
				console.log("playerID : ", playerID.playerID);
				updateUserStatus(app, playerID.playerID, "in_game");
			})

			// socket.on("endGame", (playerID:string) => {
			// 	updateUserStatus(app, playerID, "online");
			// })
		}
		else {

		updateUserStatus(app, userID, "online");

		socket.on("disconnect", () => {
			updateUserStatus(app, userID, "offline");
		});

		}
	});
};

export default socketPlugin;

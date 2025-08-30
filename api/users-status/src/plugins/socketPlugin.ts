import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import { updateUserStatus } from "./insertToDB";
import { userStatus } from "../utils/interface";

const socketPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
	
	const usersSockets = new Map<string, userStatus>();
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
		}
		if (userID == null)
		{
			socket.on("newGame", (playerID: any) => {
				if (usersSockets.has(playerID.playerID))
				{
					const userGame = usersSockets.get(playerID.playerID);
					if (userGame)
						userGame.in_game = true;
					updateUserStatus(app, playerID.playerID, "in_game");
				}

				
			})

			socket.on("endGame", (playerID: any) => {
				if (usersSockets.has(playerID.playerID))
				{
					const userGame = usersSockets.get(playerID.playerID);
					if (userGame)
					{
						console.log("here");
						userGame.in_game = false;
						if (userGame.socket.size > 0)
							updateUserStatus(app, playerID.playerID, "online");
						else
							updateUserStatus(app, playerID.playerID, "offline");
					}
				}
			});

			

		}
		else {

		if (!usersSockets.has(userID))
		{
			const newUser: userStatus = {socket: new Set<string>(), in_game: false};
			usersSockets.set(userID, newUser);
		}
		
		usersSockets.get(userID)?.socket.add(socket.id);
		if (usersSockets.get(userID)?.in_game == false)
			updateUserStatus(app, userID, "online");


		console.log("users:", userID, usersSockets.get(userID)?.socket);

		socket.on("disconnect", () => {

			const userSocket = usersSockets.get(userID);

			userSocket?.socket.delete(socket.id);

			if (userSocket?.socket.size == 0 && usersSockets.get(userID)?.in_game == false)
				updateUserStatus(app, userID, "offline");
		});

		}
	});
};

export default socketPlugin;

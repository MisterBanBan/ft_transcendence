import { FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import {createTournament} from "../socket/createTournament.js";

const socketPlugin: FastifyPluginAsync = async (app) => {
	app.io.on("connection", (socket: Socket) => {
		console.log("Client connected:", socket.id);

		const user: string | undefined | string[] = socket.handshake.query.user

		if (typeof user === 'string') {
			try {
				const jsonStr = Buffer.from(user, 'base64').toString()
				const obj = JSON.parse(jsonStr)
				console.log(obj)
			} catch (e) {
				console.error('User header could not be parsed:', e)
			}
		} else {
			console.error('No valid user in handshake')
		}

		socket.on("createTournament", (name, size, displayName) => {
			console.log("createTOURNAMENT");
			if (typeof name !== "string" || typeof size !== "number" || typeof displayName !== "string") {
				// TODO error
				return;
			}
			if (name.trim().length <= 0) {
				// TODO error
				return;
			}
			// TODO validate username
			console.log(name, "\t|", size, "\t|", displayName);
			console.log("-------------------");
			// createTournament();
		})
	});
};

export default socketPlugin;

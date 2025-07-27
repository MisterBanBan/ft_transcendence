import { FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import {createTournament} from "../socket/createTournament.js";
import updateTournamentList from "../socket/updateTournamentList.js";

const socketPlugin: FastifyPluginAsync = async (app) => {
	app.io.on("connection", (socket: Socket) => {
		const queryUser: string | undefined | string[] = socket.handshake.query.user
		let user: {
			id: number;
			username: string;
			avatar_url: string;
			provider: string;
			provider_id?: string;
			tfa: boolean;
			updatedAt: number;
		};

		if (typeof queryUser === 'string') {
			try {
				const jsonStr = Buffer.from(queryUser, 'base64').toString()
				user = JSON.parse(jsonStr)
			} catch (e) {
				console.error('User header could not be parsed:', e)
				return;
			}
		} else {
			console.error('No valid user in handshake')
			return;
		}
		console.log("Client connected:", socket.id, user.username);

		updateTournamentList(app, socket);

		socket.on("createTournament", async (name, size, displayName) => {
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
			await createTournament(app, name, size, displayName, user.id);
			const set: Set<string> = await app.io.allSockets()

			console.log(set.size)
		})
	});
};

export default socketPlugin;

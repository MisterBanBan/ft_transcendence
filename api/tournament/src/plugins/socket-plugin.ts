import { FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import {create} from "../socket/create.js";
import {join} from "../socket/join.js";
import {tournaments} from "../server.js";
import {leave} from "../socket/leave.js";
import {validateUsername} from "../utils/validate-username.js";
import updateTournamentsList from "../socket/update-tournaments-list.js";
import {updateTournamentInfo} from "../room/updateTournamentInfo.js";
import {inTournament} from "../utils/in-tournament.js";

export const usersSockets = new Map<number, Set<string>>()

const socketPlugin: FastifyPluginAsync = async (app) => {
	app.io.on("connection", async (socket: Socket) => {
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

		const hasSockets = usersSockets.has(user.id);
		if (!hasSockets)
			usersSockets.set(user.id, new Set<string>())
		usersSockets.get(user.id)?.add(socket.id);

		if (hasSockets) {
			const tournament = await inTournament(user.id)
			if (tournament) {
				socket.join(tournament.getName());
				await updateTournamentInfo(app, user.id, tournament, false);
			}
		}

		console.log("Sockets id for", user.username, ":", usersSockets.get(user.id));

		await updateTournamentsList(app, socket);

		socket.on("create", async (name, size, displayName) => {
			console.log("createTOURNAMENT");
			if (typeof name !== "string" || typeof size !== "number" || typeof displayName !== "string") {
				// TODO error
				return;
			}
			if (name.trim().length <= 0) {
				// TODO error
				return;
			}

			if (!await validateUsername(displayName)) {
				console.log("Display name", displayName, "is invalid");
				return
			}

			await create(app, socket, name, size, displayName, user.id);
		})

		socket.on("join", async (name, displayName) => {
			console.log("joinTournament");
			if (typeof name !== "string" || typeof displayName !== "string") {
				// TODO error
				console.log("Invalid type for name: ", typeof name, "| displayName:", typeof displayName)
				return;
			}

			const tournament = tournaments.get(name);
			if (!tournament) {
				// TODO error
				console.log("Tournament", name, "not found");
				return
			}

			if (!await validateUsername(displayName)) {
				console.log("Display name", displayName, "is invalid");
				return
			}

			if (tournament.hasPlayer(user.id)) {
				console.log(user.username, `(${user.id})`, 'is already in the tournament', tournament.getName())
				return
			}

			await join(app, socket, user.id, displayName, tournament);
			socket.join(name);

		})

		socket.on("disconnect", async () => {

			const userSockets = usersSockets.get(user.id);
			const tournament = await inTournament(user.id);

			if (userSockets && userSockets.size - 1 !== 0) {
				if (tournament)
					socket.leave(tournament.getName())
				userSockets.delete(socket.id);

				console.log("Sockets id for", user.username, ":", usersSockets.get(user.id));
				return;
			}

			if (tournament)
				await leave(app, socket, user.id, tournament);

			usersSockets.delete(user.id);
		})
	});
};

export default socketPlugin;

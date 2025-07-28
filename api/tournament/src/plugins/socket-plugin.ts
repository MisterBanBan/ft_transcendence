import { FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import {createTournament} from "../socket/createTournament.js";
import updateTournamentList from "../socket/updateTournamentList.js";
import {joinTournament} from "../utils/joinTournament.js";
import {tournaments} from "../server.js";
import {validateUsername} from "../utils/validateUsername.js";
import {leaveTournament} from "../utils/leaveTournament.js";

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

			if (!await validateUsername(displayName)) {
				console.log("Display name", displayName, "is invalid");
				return
			}

			await createTournament(app, name, size, displayName, user.id);
		})

		socket.on("joinTournament", async (name, displayName) => {
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

			await joinTournament(app, user.id, displayName, tournament);
		})

		socket.on("disconnect", async () => {
			for (let [_, tournament] of tournaments) {
				if (tournament.hasPlayer(user.id)) {
					await leaveTournament(app, user.id, tournament);
					break;
				}
			}
		})
	});
};

export default socketPlugin;

import { FastifyPluginAsync } from "fastify";
import { Socket } from "socket.io";
import {create} from "../socket/create.js";
import {join} from "../socket/join.js";
import {tournaments} from "../server.js";
import {leave} from "../socket/leave.js";
import updateTournamentsList from "../socket/update-tournaments-list.js";
import {inTournament} from "../utils/in-tournament.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";
import {start} from "../socket/start.js";

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

		const hasSockets = usersSockets.has(user.id);
		if (!hasSockets)
			usersSockets.set(user.id, new Set<string>())
		usersSockets.get(user.id)?.add(socket.id);

		const tournament = await inTournament(user.id)
		if (tournament) {
			socket.join(tournament.getName());
			await updateTournamentInfo(app, user.id, tournament, false);
		}
		else
			await updateTournamentsList(app, socket);

		socket.on("create", async (name, size) => {
			if (typeof name !== "string" || typeof size !== "number") {
				console.log("Invalid type for name: ", typeof name, "| number:", typeof size)
				return;
			}

			if (name.trim().length <= 0) {
				socket.emit("error", "Tournament name can't be empty")
				return;
			}

			if (name.length > 20) {
				socket.emit("error", "Tournament name needs to be below 20 characters")
				return;
			}

			if (tournaments.has(name)) {
				socket.emit("error", `Tournament with name ${name} already exists`);
				return
			}

			if (![4, 8].includes(size)) {
				socket.emit("error", `Tournament size needs to be 4 or 8, not ${size.toString()}`);
				return
			}

			await create(app, socket, name, size, user.username, user.id);
		})

		socket.on("join", async (name) => {
			if (typeof name !== "string") {
				console.log("Invalid type for name: ", typeof name)
				return;
			}

			const tournament = tournaments.get(name);
			if (!tournament) {
				socket.emit("error", `Tournament ${name} not found`);
				return
			}

			if (tournament.isFull()) {
				socket.emit("error", `Tournament ${tournament.getName()} is full`)
				return
			}

			if (tournament.hasStarted()) {
				socket.emit("error", `Tournament ${name} already started`)
				return
			}

			if (tournament.hasPlayer(user.id)) {
				socket.emit("error", `You are already in the tournament ${tournament.getName()}`)
				return
			}

			await join(app, user.id, user.username, tournament);
			socket.join(name);

		})

		socket.on("start", async () => {

			const tournament = await inTournament(user.id);
			if (!tournament) {
				socket.emit("error", `${user.username} is not in a tournament`);
				return
			}

			if (!tournament.hasOwnership(user.id)) {
				socket.emit("error", `You are not the owner of the tournament ${tournament.getName()}`)
				return
			}

			if (tournament.hasStarted()) {
				socket.emit("error", `Tournament ${tournament.getName()} already started`)
				return
			}

			if (!tournament.isFull()) {
				socket.emit("error", `Tournament ${tournament.getName()} is not full` )
				return
			}

			tournament.start();
			await updateTournamentsList(app, socket);
			await start(app, tournament);
		})

		socket.on("leave", async () => {

			const tournament = await inTournament(user.id);
			if (!tournament) {
				socket.emit("error", `You are not in a tournament`);
				return
			}

			await leave(app, user.id, tournament);
		})

		socket.on("disconnect", async () => {

			const userSockets = usersSockets.get(user.id);
			const tournament = await inTournament(user.id);

			if (userSockets && userSockets.size - 1 !== 0) {
				userSockets.delete(socket.id);
				return;
			}

			if (tournament)
				socket.leave(tournament.getName())

			usersSockets.delete(user.id);
		})
	});
};

export default socketPlugin;

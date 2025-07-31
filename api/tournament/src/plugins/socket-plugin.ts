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

		socket.on("create", async (name, size) => {
			if (typeof name !== "string" || typeof size !== "number") {
				console.log("Invalid type for name: ", typeof name, "| number:", typeof size)
				return;
			}

			if (name.trim().length <= 0) {
				console.log("Tournament name can't be empty,");
				return;
			}

			if (name.length > 20) {
				console.log("Tournament name needs to be below 20 characters");
				return;
			}

			if (tournaments.has(name)) {
				console.log("Tournament with name", name, "already exists");
				return
			}

			if (![4, 8].includes(size)) {
				console.log("Tournament size needs to be 4 or 8, not", size.toString());
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
				console.log("Tournament", name, "not found");
				return
			}

			if (tournament.hasStarted()) {
				console.log("Tournament", name, "already started")
				return
			}

			if (tournament.hasPlayer(user.id)) {
				console.log(user.username, `(${user.id})`, 'is already in the tournament', tournament.getName())
				return
			}

			await join(app, user.id, user.username, tournament);
			socket.join(name);

		})

		socket.on("start", async () => {

			const tournament = await inTournament(user.id);
			if (!tournament) {
				console.log(`${user.username} is not in a tournament`);
				return
			}

			if (!tournament.hasOwnership(user.id)) {
				console.log(`${user.username} (${user.id}) is not the owner of the tournament` )
				return
			}

			if (tournament.hasStarted()) {
				console.log("Tournament", tournament.getName(), "already started")
				return
			}

			if (!tournament.isFull()) {
				console.log(`Tournament ${tournament.getName()} is not full` )
				return
			}

			tournament.start();
			await  updateTournamentsList(app, socket);
			await start(app, tournament);
		})

		socket.on("leave", async () => {

			const tournament = await inTournament(user.id);
			if (!tournament) {
				console.log(`${user.username} is not in a tournament`);
				return
			}

			await leave(app, user.id, tournament);
		})

		// Dev only
		socket.on("fakeJoin", async () => {

			const tournament = await inTournament(user.id);
			if (!tournament) {
				console.log(`${user.username} is not in a tournament`);
				return
			}

			await join(app, 22, "Coucou", tournament)
			await join(app, 23, "Bonjour", tournament)
			await join(app, 24, "Hello", tournament)

			if (tournament.getSize() === 8) {
				await join(app, 18, "cOUCOU", tournament)
				await join(app, 19, "mbaron-t", tournament)
				await join(app, 20, "Mael-tFOJlb", tournament)
				await join(app, 25, "YoLeBoss", tournament)
			}
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
				await leave(app, user.id, tournament);

			usersSockets.delete(user.id);
		})
	});
};

export default socketPlugin;

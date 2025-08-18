import {emitAll} from "../utils/emit-all.js";
import {FastifyInstance} from "fastify";
import {wait} from "../utils/wait.js";
import {usersSockets} from "../plugins/socket-plugin.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";
import {tournaments} from "../server.js";
import updateTournamentsList from "../socket/update-tournaments-list.js";
import {leave} from "../socket/leave.js";

export class Match {
	private player1?: number;
	private player2?: number;
	private winner?: number;

	constructor() {
		this.player1 = undefined
		this.player2 = undefined
		this.winner = undefined
	}

	private isPresent(player: number | undefined, tournament: Tournament): boolean {
		return player !== undefined &&
			usersSockets.has(player) &&
			tournament.getPlaying().has(player);
	}

	public async startMatch(app: FastifyInstance, tournament: Tournament): Promise<void> {

		const p1Present = this.isPresent(this.player1, tournament);
		const p2Present = this.isPresent(this.player2, tournament);

		if (!p1Present && !p2Present) {
			this.winner = undefined;
			return Promise.resolve();
		}

		if (p1Present && !p2Present) {
			this.winner = this.player1;

			if (this.player2 && tournament.getPlaying().has(this.player2))
				await leave(app, this.player2, tournament);
			else
				await updateTournamentInfo(app, this.player1!, tournament, false);

			return Promise.resolve();
		}

		if (!p1Present && p2Present) {
			this.winner = this.player2;

			if (this.player1 && tournament.getPlaying().has(this.player1))
				await leave(app, this.player1, tournament);
			else
				await updateTournamentInfo(app, this.player2!, tournament, false);

			return Promise.resolve();
		}

		const body = { client1: this.player1!.toString(), client2: this.player2!.toString() } as { client1: string, client2: string }
		const fetchPromise = fetch('http://matchmaking:8083/api/matchmaking/private', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				'Origin': 'tournament'
			}
		})

		emitAll(app, this.player1!, "newMatch", undefined);
		emitAll(app, this.player2!, "newMatch", undefined);

		tournament.changeState(this.player1!, "Playing");
		tournament.changeState(this.player2!, "Playing");
		await updateTournamentInfo(app, 0, tournament, true);

		const response = await fetchPromise;
		const results = await response.json()

		if (results.status === "ok") {
			this.winner = parseInt(results.result.key);
		}

		else if (results.status == "timeout") {
			const players = results.players

			if (players.length === 2)
				this.winner = undefined
			else {
				const loser = parseInt(players[0]);
				if (loser === this.player1)
					this.winner = this.player2
				else
					this.winner = this.player1
			}
		}

		emitAll(app, this.player1!, "matchEnded", undefined)
		emitAll(app, this.player2!, "matchEnded", undefined)

		tournament.changeState(this.player1!, "Waiting");
		tournament.changeState(this.player2!, "Waiting");

		await updateTournamentInfo(app, 0, tournament, true);

		await wait(2000)

		return Promise.resolve()
	}

	public getPlayer1(): number | undefined {
		return this.player1
	}

	public getPlayer2(): number | undefined {
		return this.player2
	}

	public getWinner(): number | undefined {
		return this.winner
	}

	public setPlayer1(player: number | undefined) {
		this.player1 = player
	}

	public setPlayer2(player: number | undefined) {
		this.player2 = player
	}
}

export interface TournamentStructure {
	rounds: Match[][];
	winner?: number;
}

export class Tournament {

	private readonly name: string;
	private readonly size: number;
	private owner: number;
	private timer: NodeJS.Timeout | null = null;
	private timeLeft: number = 0;
	private participants: Map<number, { name: string, state: string }> = new Map();
	private playing: Set<number> = new Set();
	private structure: TournamentStructure = { rounds: [], winner: undefined};
	private started: boolean = false;

	constructor(app: FastifyInstance, name: string, owner: number, size: number) {
		this.name = name;
		this.owner = owner;
		this.size = size;

		this.timeLeft = 300;

		this.timer = setInterval(() => {
			this.timeLeft--;
			emitAll(app, 0, "updateTimer", name, name, this.timeLeft.toString());

			if (this.timeLeft <= 0) {
				emitAll(app, 0, "leftTournament", name);
				app.io.socketsLeave(name);
				tournaments.delete(name);

				updateTournamentsList(app)
			}
		}, 1000);
	}

	public setOwner(owner: number) {
		this.owner = owner;
	}

	public getName(): string {
		return this.name;
	}

	public getOwner(): number {
		return this.owner;
	}

	public getStructure(): TournamentStructure {
		return this.structure;
	}

	public getSize(): number {
		return this.size;
	}

	public getParticipants(): Map<number, { name: string, state: string }> {
		return this.participants;
	}

	public getPlaying(): Set<number> {
		return this.playing
	}

	public addPlayer(userId: number, displayName: string) {
		this.participants.set(userId, { name: displayName, state: "Waiting" });
		if (!this.playing.has(userId))
			this.playing.add(userId);
	}

	public removePlayer(userId: number) {
		if (!this.started)
			this.participants.delete(userId);
		this.playing.delete(userId);
	}

	public hasPlayer(userId: number) {
		if (this.started)
			return this.playing.has(userId)
		else
			return this.participants.has(userId);
	}

	public hasStarted(): boolean {
		return this.started
	}

	public hasOwnership(userId: number) {
		return this.owner === userId;
	}

	public isFull(): boolean {
		return this.participants.size >= this.size;
	}

	public changeState(userId: number, state: "Waiting" | "Playing" | "Left") {
		const user = this.participants.get(userId)
		if (user)
			this.participants.set(userId, { name: user.name, state: state });
	}

	public start(): void {
		this.started = true

		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}
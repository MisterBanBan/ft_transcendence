import {emitAll} from "../utils/emit-all.js";
import {FastifyInstance} from "fastify";
import {wait} from "../utils/wait.js";
import {usersSockets} from "../plugins/socket-plugin.js";
import {updateTournamentInfo} from "../room/update-tournament-info.js";

export class Match {
	private player1?: number;
	private player2?: number;
	private winner?: number;

	constructor() {
		this.player1 = undefined
		this.player2 = undefined
		this.winner = undefined
	}

	public async startMatch(app: FastifyInstance, tournament: Tournament): Promise<void> {

		if ((this.player1 === undefined && this.player2 === undefined) ||
			((this.player1 && !usersSockets.has(this.player1)) && ((this.player2 && !usersSockets.has(this.player2))))) {
			this.winner = undefined
			return Promise.resolve()
		}

		if ((this.player1 !== undefined && this.player2 === undefined) ||
			((this.player1 && usersSockets.has(this.player1)) && (this.player2 && !usersSockets.has(this.player2)))) {
			this.winner = this.player1

			await updateTournamentInfo(app, this.player1, tournament, false)
			return Promise.resolve()
		}

		if ((this.player1 === undefined && this.player2 !== undefined) ||
			((this.player2 && usersSockets.has(this.player2)) && (this.player1 && !usersSockets.has(this.player1)))) {
			this.winner = this.player2

			await updateTournamentInfo(app, this.player2, tournament, false)
			return Promise.resolve()
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

		const response = await fetchPromise;
		const results = await response.json()

		if (results.status === "ok") {
			console.log(results.result);
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
	private participants: Map<number, string> = new Map();
	private structure: TournamentStructure = { rounds: [], winner: undefined};
	private started: boolean = false;

	constructor(name: string, owner: number, size: number) {
		this.name = name;
		this.owner = owner;
		this.size = size;
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
	public getParticipants(): Map<number, string> {
		return this.participants;
	}

	public addPlayer(userId: number, displayName: string) {
		this.participants.set(userId, displayName);
	}

	public removePlayer(userId: number) {
		if (!this.started)
			this.participants.delete(userId);
	}

	public hasPlayer(userId: number) {
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

	public start(): void {
		this.started = true
	}
}
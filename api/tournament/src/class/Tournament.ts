import {emitAll} from "../utils/emit-all.js";
import {FastifyInstance} from "fastify";
import {wait} from "../socket/start.js";

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
		console.log(Date.now(), "Starting match")
		if (this.player1 === undefined && this.player2 === undefined) {
			this.winner = undefined
			return Promise.resolve()
		}

		if (this.player1 !== undefined && this.player2 === undefined) {
			this.winner = this.player1
			return Promise.resolve()
		}

		if (this.player1 === undefined && this.player2 !== undefined) {
			this.winner = this.player2
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

		console.log(results)
		if (results.status === "ok") {
			this.winner = parseInt(results.result.key);
		}
		else if (results.status == "timeout") {
			const loser = parseInt(results.player);
			if (loser === this.player1)
				this.winner = this.player2
			else
				this.winner = this.player1
		}

		emitAll(app, this.player1!, "matchEnded", undefined)
		emitAll(app, this.player2!, "matchEnded", undefined)

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
	private readonly owner: number;
	private readonly size: number;
	private players: Map<number, string> = new Map();
	private structure: TournamentStructure = { rounds: [], winner: undefined};
	private started: boolean = false;

	constructor(name: string, owner: number, size: number) {
		this.name = name;
		this.owner = owner;
		this.size = size;
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

	public getPlayers(): Map<number, string> {
		return this.players;
	}

	public addPlayer(userId: number, displayName: string) {
		this.players.set(userId, displayName);
	}

	public removePlayer(userId: number) {
		this.players.delete(userId);
	}

	public hasPlayer(userId: number) {
		return this.players.has(userId);
	}

	public hasStarted(): boolean {
		return this.started
	}

	public hasOwnership(userId: number) {
		return this.owner === userId;
	}

	public isFull(): boolean {
		return this.players.size >= this.size;
	}

	public start(): void {
		this.started = true
	}
}
export class Match {
	private player1?: number;
	private player2?: number;
	private winner?: number;

	constructor() {
		this.player1 = undefined
		this.player2 = undefined
		this.winner = undefined
	}

	public async startMatch(): Promise<void> {
		console.log("Starting match")
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

		// TODO starting game

		this.winner = Math.random() < 0.5 ? this.player1! : this.player2!
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
	winner?: string;
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
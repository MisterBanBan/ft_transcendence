export interface Match {
	player1?: number;
	player2?: number;
	winner?: number;
}

interface TournamentStructure {
	rounds: {
		[rounds: string]: Match[];
	};
	winner?: string;
}

export class Tournament {

	private	name: string;
	private owner: number;
	private size: number;
	private players: Map<number, string> = new Map();
	private structure: TournamentStructure = { rounds: {}, winner: undefined};

	constructor(name: string, owner: number, size: number) {
		this.name = name;
		this.owner = owner;
		this.size = size;
	}

	public getStructure(): TournamentStructure {
		return this.structure;
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

	public isFull(): boolean {
		return this.players.size >= this.size;
	}
}
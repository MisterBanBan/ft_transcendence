import { Socket } from "socket.io";

export interface waitingUser {
	socket: Socket;
	userID: string;
}

export interface playerInfo {
	userID: string;
	gameId: string;
	side: string;
	type: string; // "local", "online", "ai", "private"
}

export interface inputData {
	direction: string;
	state: boolean;
	player: string;
}

export interface privateInfo {
	opponent: string;
	type: string;
}

export interface EndMatchBody {
    player1_id: string;
    player2_id: string;
    winner_id: string;
    player1_score: number;
    player2_score: number;
    game_type?: 'online' | 'tournament';
}
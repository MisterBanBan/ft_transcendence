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
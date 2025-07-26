import { Socket } from "socket.io";

export interface waitingUser {
	socket: Socket;
	userID: string;
}

export interface playerInfo {
	userID: string;
	gameId: string;
	side: string;
}

export interface inputData {
	direction: string;
	state: boolean;
	player: string;
}
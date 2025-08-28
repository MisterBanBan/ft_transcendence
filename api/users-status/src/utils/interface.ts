export interface playerInfo {
	userID: string;
	gameId: string;
	side: string;
	type: string; // "local", "online", "ai", "private"
}

export interface privateInfo {
	opponent: string;
	type: string;
}
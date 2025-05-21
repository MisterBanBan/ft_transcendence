export interface User {
	username: string;
	password: string;
	tfa?: string;
	updatedAt: number;
}
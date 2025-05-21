export interface User {
	username: string;
	password: string;
	tfa?: string;
	provider: string;
	provider_id?: string;
	updatedAt: number;
}
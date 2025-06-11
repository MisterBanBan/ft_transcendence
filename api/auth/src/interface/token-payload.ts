export interface TokenPayload {
	id: number;
	username: string;
	provider: string;
	provider_id?: string;
	updatedAt: number;
}
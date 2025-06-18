import { Database } from "sqlite";

declare module 'fastify' {
	interface FastifyInstance {
		db: Database
		usersDb: Database
	}
	interface FastifyRequest {
		currentUser?: {
			id: number;
			username: string;
			avatar_url: string;
			provider: string;
			provider_id?: string;
			tfa: boolean;
			updatedAt: number;
		};
	}
}
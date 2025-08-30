import { Database } from "sqlite";

declare module 'fastify' {
    interface FastifyInstance {
        io: Server
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
import { Database } from "sqlite";

declare module 'fastify' {
    interface FastifyInstance {
        db: Database
        io: Server
        gameSocket: Socket;
        playerToGame: Map<string, { playerName: string, gameId: string, side: string }>;
    }
}
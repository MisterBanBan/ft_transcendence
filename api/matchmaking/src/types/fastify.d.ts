import { Database } from "sqlite";
import { playerInfo, privateInfo } from "../utils/interface";

declare module 'fastify' {
    interface FastifyInstance {
        db: Database
        io: Server
        gameSocket: Socket;
        aiSocket: Socket;
        playerToGame: Map<string, playerInfo>;
        privateQueue: Map<string, privateInfo>;
        privateResult: Map<string, privateInfo>;
    }
}
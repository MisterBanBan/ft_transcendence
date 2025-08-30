import { Database } from "sqlite";
import { playerInfo, privateInfo } from "../utils/interface";

declare module 'fastify' {
    interface FastifyInstance {
        userDb: Database
        io: Server
        gameSocket: Socket;
        aiSocket: Socket;
        usersSocket: Socket;
        playerToGame: Map<string, playerInfo>;
        privateQueue: Map<string, privateInfo>;
        privateResult: Map<string, privateInfo>;
    }
}

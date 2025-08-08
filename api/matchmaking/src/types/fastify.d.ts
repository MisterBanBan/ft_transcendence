import { Database } from "sqlite";
import { playerInfo, privateInfo } from "../utils/interface";

declare module 'fastify' {
    interface FastifyInstance {
        db: Database
        userDb: Database
        io: Server
        gameSocket: Socket;
        aiSocket: Socket;
        playerToGame: Map<string, playerInfo>;
        privateQueue: Map<string, privateInfo>;
        privateResult: Map<string, privateInfo>;
    }
}

export interface EndMatchBody {
    player1_id: string;
    player2_id: string;
    winner_id: string;
    player1_score: number;
    player2_score: number;
    game_type?: 'online' | 'tournament';
}
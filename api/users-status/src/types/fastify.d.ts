import { Database } from "sqlite";
import { playerInfo, privateInfo } from "../utils/interface";

declare module 'fastify' {
    interface FastifyInstance {
        db: Database
        userDb: Database
        io: Server
    }
}

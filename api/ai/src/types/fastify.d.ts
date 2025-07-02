import { Database } from "sqlite";

declare module 'fastify' {
    interface FastifyInstance {
        io: Server
    }
}
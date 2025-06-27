import { FastifyInstance } from 'fastify';
import { UserService } from '../services/userService.js';

declare module 'fastify' {
    interface FastifyInstance {
        userService: UserService;
    }
}

export default async function (fastify: FastifyInstance) {
    const userService = new UserService(fastify.db);
    fastify.decorate('userService', userService);
}

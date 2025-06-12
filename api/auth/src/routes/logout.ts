import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/auth/logout', async (request, reply) => {
        // Supprime le cookie côté client
        reply.clearCookie('token'); // ou le nom de ton cookie JWT
        return reply.status(200).send({ success: true, message: "Logged out" });
    });
}
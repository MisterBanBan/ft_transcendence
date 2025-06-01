import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.get('/api/users/', async function (request, reply) {
        try {
            const users = await this.db.all('SELECT * FROM users');
            reply.code(200).send({users});
        } catch (err) {
            reply.code(500).send({error: "creation or restore failed."});
        }
    });
}
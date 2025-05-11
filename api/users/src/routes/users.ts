import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/users/', async function (request, reply) {
        try {
            await this.db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                'testuser1',
                'pass1234'
            );
            reply.code(201).send({ message: "Utilisateur créé !" });
        } catch (err) {
            reply.code(500).send({ error: "Erreur lors de la création de l'utilisateur." });
        }
    });
    server.get('/api/users/', async function (request, reply) {
        try {
            const users = await this.db.all('SELECT * FROM users');
            reply.code(200).send({users});
        } catch (err) {
            reply.code(500).send({error: "creation or restore failed."});
        }
    });
}
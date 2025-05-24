import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/users/', async function (request, reply) {
        try {
            await this.db.run(
                'INSERT INTO users (username, password, avatar_url) VALUES (?, ?, ?)',
                'testuser1',
                'pass1234',
                'https://play-lh.googleusercontent.com/MPmWB25moeb9kF_Wnwm0mdDM599AIhUgn3iCO6r6vgVo85Iv-l7s_XKWZsD92FJjoMs'
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
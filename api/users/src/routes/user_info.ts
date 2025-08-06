/*
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.get('/api/users/:id', async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id;

            const user = await server.db.get(
                'SELECT id, username, avatar_url FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return reply.code(404).send({error: 'User not found'});
            }

            console.log(user.avatar_url);

            return {
                id: user.id,
                username: user.username,
                avatar_url: user.avatar_url
            };
        } catch (error) {
            console.error('Erreur lors de la récupération utilisateur:', error);
            return reply.code(500).send({error: 'Internal server error'});
        }
    });
}*/

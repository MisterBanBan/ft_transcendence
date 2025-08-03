import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.get('/api/users/:id/profile', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', pattern: '^\\d+$' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id;

            const user = await server.db.get(
                'SELECT id, username, avatar_url FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return reply.code(404).send({ error: 'User not found' });
            }

            return {
                id: user.id,
                username: user.username,
                avatar_url: user.avatar_url ? `/uploads/${user.avatar_url}` : null
            };

        } catch (error) {
            console.error('Profile fetch error:', error);
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });
}
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    const updateNameSchema = {
        body: {
            type: 'object',
            required: ['newUsername'],
        },
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'string' }
            }
        }
    };

    server.post('/api/users/:id/UpdateName',
        { schema: updateNameSchema },
        async (request, reply) => {
            try {
                const userId = (request.params as { id: string }).id;

                const { newUsername } = request.body as { newUsername: string };

                const result = await server.db.run(
                    'UPDATE users SET username = ? WHERE id = ?',
                    [newUsername, userId]
                );

                if (result.changes === 0) {
                    console.error('User not found:', userId);
                    return reply.code(404).send({ error: 'User not found' });
                }

                return reply.code(200).send({
                    message: 'Username updated successfully',
                    userId: userId,
                    newUsername: newUsername
                });

            } catch (error) {
                console.error('Error updating username:', error);
                return reply.code(500).send({ error: 'Internal server error' });
            }
        }
    );
}
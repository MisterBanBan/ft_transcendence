import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    const createUserSchema = {
        body: {
            type: 'object',
            required: ['userId', 'username'],
            properties: {
                userId: { type: 'string' },
                username: { type: 'string' }
            }
        }
    };

    server.post('/api/users/create',
        { schema: createUserSchema },
        async (request, reply) => {
            try {

                const { userId, username } = request.body as { userId: string; username: string };

                const result = await server.db.run(`
                    INSERT INTO users (id, username, avatar_url)
                    VALUES (?, ?, 'fleur.jpeg')
                `, userId, username);

                return reply.code(201).send({
                    success: true,
                    message: 'User created successfully',
                    user: {
                        id: userId,
                        username: username
                    }
                });

            } catch (error) {
                console.error('Error creating user:', error);

                if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    return reply.code(409).send({
                        error: 'Username already exists'
                    });
                }

                return reply.code(500).send({
                    error: 'Internal server error'
                });
            }
        }
    );
}

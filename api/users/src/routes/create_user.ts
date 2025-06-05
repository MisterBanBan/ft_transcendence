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
                    INSERT INTO users (id, username)
                    VALUES (?, ?)
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

                return reply.code(500).send({
                    error: 'Internal server error'
                });
            }
        }
    );
}

import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (server: FastifyInstance) {
    server.delete<{
        Body: { friendId: string };
    }>('/api/users/removeFriend', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    friendId: { type: 'string' }
                },
                required: ['friendId']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        removed_relationship: {
                            type: 'object',
                            properties: {
                                friendId: { type: 'string' },
                                userId: { type: 'string' },
                            }
                        }
                    }
                },
                401: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                },
                500: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request: FastifyRequest, reply) => {
        const { friendId } = request.body as { friendId: string };
        const userId = request.currentUser?.id;

        if (!userId) {
            return reply.status(401).send({ error: 'User not authenticated' });
        }

        if (String(userId) === String(friendId)) {
            return reply.status(400).send({ error: 'Cannot remove yourself as friend' });
        }

        try {
            const requesterExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                userId
            );
            const friendExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                friendId
            );



            if (!requesterExists || !friendExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            const existingRelation = await server.db.get(
                `SELECT * FROM relationships
                 WHERE ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?))
                   AND status_r = 'accepted'`,
                userId, friendId, friendId, userId
            );


            if (!existingRelation) {
                return reply.status(404).send({ error: 'Friendship not found' });
            }

            const deleteResult = await server.db.run(
                `DELETE FROM relationships
                 WHERE ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?))
                   AND status_r = 'accepted'`,
                userId, friendId, friendId, userId
            );


            return reply.status(200).send({
                message: 'Friend removed successfully',
                removed_relationship: {
                    userId: String(userId),
                    friendId: String(friendId),
                }
            });
        } catch (error) {
            console.error('Database error in removeFriend:', error);
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

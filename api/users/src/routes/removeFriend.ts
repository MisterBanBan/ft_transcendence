import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (server: FastifyInstance) {
    server.delete<{
        Params: { friendId: string };
    }>('/api/users/:friendId/removeFriend', {
        schema: {
            params: {
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
        const { friendId } = request.params as { friendId: string };

        if (!friendId || friendId.trim() === '') {
            console.log('Invalid friendId parameter:', friendId);
            return reply.status(400).send({ error: 'Invalid friend ID parameter' });
        }

        const userId = request.currentUser?.id;

        console.log('Removing friend request:', {
            friendId,
            userId,
            hasCurrentUser: !!request.currentUser
        });

        if (!userId) {
            console.log('User not authenticated:', request.currentUser);
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

            console.log('User existence check:', {
                requesterExists: !!requesterExists,
                friendExists: !!friendExists
            });

            if (!requesterExists || !friendExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            const existingRelation = await server.db.get(
                `SELECT * FROM relationships
                 WHERE ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?))
                   AND status = 'accepted'`,
                userId, friendId, friendId, userId
            );

            console.log('Existing relationship:', existingRelation);

            if (!existingRelation) {
                return reply.status(404).send({ error: 'Friendship not found' });
            }

            const deleteResult = await server.db.run(
                `DELETE FROM relationships 
                 WHERE ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?))
                 AND status = 'accepted'`,
                userId, friendId, friendId, userId
            );

            console.log('Delete result:', deleteResult);

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

import {FastifyInstance} from "fastify";
import {UserParams, RemoveFriendBody} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.delete<{
        Params: UserParams;
        Body: RemoveFriendBody;
    }>('/api/users/:userId/removeFriend', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            },
            body: {
                type: 'object',
                properties: {
                    friend_id: { type: 'string' }
                },
                required: ['friend_id']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        removed_relationship: {
                            type: 'object',
                            properties: {
                                requester_id: { type: 'string' },
                                addressee_id: { type: 'string' },
                                status: { type: 'string' }
                            }
                        }
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
                }
            }
        }
    }, async (request, reply) => {
        const { userId: requester_id } = request.params;
        const { friend_id } = request.body;

        console.log('Removing friend:', friend_id, 'for user:', requester_id);

        try {
            const requesterExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                requester_id
            );
            const friendExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                friend_id
            );

            if (!requesterExists || !friendExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            if (requester_id === friend_id) {
                return reply.status(400).send({ error: 'Cannot remove yourself' });
            }

            const existingRelation = await server.db.get(
                `SELECT * FROM relationships 
                 WHERE ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?))
                 AND status = 'accepted'`,
                requester_id, friend_id, friend_id, requester_id
            );

            if (!existingRelation) {
                return reply.status(404).send({ error: 'Friendship not found' });
            }

            await server.db.run(
                `DELETE FROM relationships 
                 WHERE ((requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?))
                 AND status = 'accepted'`,
                requester_id, friend_id, friend_id, requester_id
            );

            return reply.status(200).send({
                message: 'Friend removed successfully',
                removed_relationship: {
                    requester_id: existingRelation.requester_id,
                    addressee_id: existingRelation.addressee_id,
                    status: existingRelation.status
                }
            });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

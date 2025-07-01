import {FastifyInstance} from "fastify";
import {BlockUserBody, UserParams} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.post<{
        Params: UserParams;
        Body: BlockUserBody;
    }>('/api/users/:userId/blockUser', {
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
                    blocked_user_id: { type: 'string' }
                },
                required: ['blocked_user_id']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        blocked_relationship: {
                            type: 'object',
                            properties: {
                                requester_id: { type: 'string' },
                                addressee_id: { type: 'string' },
                                status: { type: 'string' }
                            }
                        }
                    }
                },
                201: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        blocked_relationship: {
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
        const { userId: blocker_id } = request.params;
        const { blocked_user_id } = request.body;

        console.log('Blocking user:', blocked_user_id, 'by user:', blocker_id);

        try {
            // Check if both users exist
            const blockerExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                blocker_id
            );
            const blockedUserExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                blocked_user_id
            );

            if (!blockerExists || !blockedUserExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            // Prevent self-blocking
            if (blocker_id === blocked_user_id) {
                return reply.status(400).send({ error: 'Cannot block yourself' });
            }

            // Check if relationship already exists
            const existingRelation = await server.db.get(
                `SELECT * FROM relationships 
                 WHERE (requester_id = ? AND addressee_id = ?) 
                 OR (requester_id = ? AND addressee_id = ?)`,
                            blocker_id, blocked_user_id, blocked_user_id, blocker_id
            );

            if (existingRelation) {
                if (existingRelation.requester_id === blocked_user_id) {
                    await server.db.run(
                        'DELETE FROM relationships WHERE requester_id = ? AND addressee_id = ?',
                        blocked_user_id, blocker_id
                    );

                    await server.db.run(
                        'INSERT INTO relationships (requester_id, addressee_id, status) VALUES (?, ?, ?)',
                        blocker_id, blocked_user_id, 'blocked'
                    );
                } else {
                    await server.db.run(
                        'UPDATE relationships SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE requester_id = ? AND addressee_id = ?',
                        'blocked', blocker_id, blocked_user_id
                    );
                }

                return reply.status(200).send({
                    message: 'User blocked successfully',
                    blocked_relationship: {
                        requester_id: blocker_id,
                        addressee_id: blocked_user_id,
                        status: 'blocked'
                    }
                });
            }

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
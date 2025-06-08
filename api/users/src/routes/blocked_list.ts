import {FastifyInstance} from "fastify";
import {UserParams} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.get<{
        Params: UserParams;
    }>('/api/users/:userId/blockedList', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        blocked: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    username: { type: 'string' },
                                    avatar_url: { type: 'string' },
                                    blocked_at: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { userId } = request.params;

        console.log('Getting blocked users for user:', userId);

        try {
            // Check if user exists
            const userExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                userId
            );

            if (!userExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            // Get all blocked users with their information
            const blockedUsers = await server.db.all(
                `SELECT u.id, u.username, u.avatar_url, r.updated_at as blocked_at
                 FROM relationships r
                 JOIN users u ON r.addressee_id = u.id
                 WHERE r.requester_id = ? AND r.status = 'blocked'
                 ORDER BY r.updated_at DESC`,
                userId
            );

            return reply.status(200).send({
                message: 'Blocked users retrieved successfully',
                blocked: blockedUsers
            });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

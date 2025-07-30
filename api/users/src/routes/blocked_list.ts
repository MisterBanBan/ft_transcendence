import {FastifyInstance} from "fastify";
import {UserParams} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.get<{
        Params: UserParams;
        Headers: {
            'user-id': string;
        }
    }>('/api/users/:userId/blockedList', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            },
            headers: {
                type: 'object',
                properties: {
                    'user-id': { type: 'string' }
                },
                required: ['user-id']
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
                                    avatar_url: { type: ['string', 'null'] },
                                    blocked_at: { type: 'string' }
                                },
                                required: ['id', 'username']
                            }
                        }
                    },
                    required: ['message', 'blocked']
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    },
                    required: ['error']
                },
                500: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    },
                    required: ['error']
                }
            }
        }
    }, async (request, reply) => {
        const { userId } = request.params;
        const requesterId = request.headers['user-id'];

        console.log('Getting blocked users for user:', userId);
        console.log('Request from user:', requesterId);

        if (userId !== requesterId) {
            return reply.status(403).send({ error: 'Forbidden: Cannot access other user\'s blocked list' });
        }

        try {
            // Check if user exists
            const userExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                userId
            );

            if (!userExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            const blockedUsers = await server.db.all(
                `SELECT u.id, u.username, u.avatar_url,
                        datetime(r.updated_at) as blocked_at
                 FROM relationships r
                          JOIN users u ON r.addressee_id = u.id
                 WHERE r.requester_id = ? AND r.status = 'blocked'
                 ORDER BY r.updated_at DESC`,
                userId
            );

            const formattedBlockedUsers = blockedUsers.map(user => ({
                ...user,
                avatar_url: user.avatar_url || null
            }));

            return reply.status(200).send({
                message: 'Blocked users retrieved successfully',
                blocked: formattedBlockedUsers
            });

        } catch (error) {
            server.log.error('Error fetching blocked users:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

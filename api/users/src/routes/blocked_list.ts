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
                        friends: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    username: { type: 'string' },
                                    avatar_url: { type: 'string' },
                                    status: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { userId } = request.params;

        try {
            const blocked = await server.db.all(`
                SELECT DISTINCT u.id, u.username, u.avatar_url, r.status
                FROM relationships r
                JOIN users u ON (
                    (r.requester_id = ? AND r.addressee_id = u.id) OR 
                    (r.addressee_id = ? AND r.requester_id = u.id)
                )
                WHERE r.status = 'blocked' AND u.id != ?
            `, userId, userId, userId);

            return reply.send({ blocked });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
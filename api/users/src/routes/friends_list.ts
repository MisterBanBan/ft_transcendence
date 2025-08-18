import {FastifyInstance, FastifyRequest} from "fastify";
import {UserParams} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.get<{
        Params: UserParams;
    }>('/api/users/friendsList', {
        schema: {
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
    }, async (request: FastifyRequest, reply) => {
        const userId = request.currentUser?.id;

        if (!userId)
            return reply.status(401).send({
                error: 'User not authenticated'
            });

        try {
            const friends = await server.db.all(`
                SELECT DISTINCT u.id, u.username, u.avatar_url, u.status
                FROM relationships r
                JOIN users u ON (
                    (r.requester_id = ? AND r.addressee_id = u.id) OR 
                    (r.addressee_id = ? AND r.requester_id = u.id)
                )
                WHERE r.status_r = 'accepted' AND u.id != ?
            `, userId, userId, userId);

            return reply.send({ friends });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

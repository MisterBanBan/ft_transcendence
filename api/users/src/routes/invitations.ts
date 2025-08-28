import {FastifyInstance, FastifyRequest} from "fastify";
import { UserParams } from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.get<{
        Params: UserParams;
    }>('/api/users/invitations', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        invitations: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    requester_id: { type: 'string' },
                                    username: { type: 'string' },
                                    avatar_url: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (request: FastifyRequest, reply) => {
        const userId = request.currentUser?.id;

        if (!userId) {
            return reply.status(401).send({
                error: 'User not authenticated'
            });
        }

        try {
            const invitations = await server.db.all(`
                SELECT r.requester_id, u.username, u.avatar_url
                FROM relationships r
                         JOIN users u ON r.requester_id = u.id
                WHERE r.addressee_id = ? AND r.status_r = 'pending'
            `, userId);

            return reply.send({
                message: 'Invitations retrieved successfully',
                invitations
            });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

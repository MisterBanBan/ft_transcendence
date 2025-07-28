import {FastifyInstance, FastifyRequest} from "fastify";
import { UserParams } from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.get<{
        Params: UserParams;
    }>('/api/users/:userId/invitations', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        invitations: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    requester_id: { type: 'string' },
                                    addressee_id: { type: 'string' },
                                    status: { type: 'string' },
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

        try {
            const invitations = await server.db.all(`
                SELECT r.*, u.username, u.avatar_url 
                FROM relationships r 
                JOIN users u ON r.requester_id = u.id 
                WHERE r.addressee_id = ? AND r.status = 'pending'
            `, userId);

            return reply.send({ invitations });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
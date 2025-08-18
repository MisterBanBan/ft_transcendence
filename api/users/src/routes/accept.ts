import { FastifyInstance, FastifyRequest } from "fastify";

export default async function (server: FastifyInstance) {
    server.put<{
        Params: { requesterId: string };
    }>('/api/users/invitations/:requesterId/accept', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    requesterId: { type: 'string' }
                },
                required: ['requesterId']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        invitation: {
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
                403: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                },
                401: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request: FastifyRequest, reply) => {
        const userId = request.currentUser?.id;
        const { requesterId } = request.params as { requesterId: string };

        if (!userId) {
            return reply.status(401).send({
                error: 'User not authenticated'
            });
        }

        try {
            const invitation = await server.db.get(
                'SELECT * FROM relationships WHERE requester_id = ? AND addressee_id = ? AND status_r = ?',
                requesterId, userId, 'pending'
            );

            if (!invitation) {
                return reply.status(404).send({
                    error: 'Invitation not found or already processed'
                });
            }

            const result = await server.db.run(
                'UPDATE relationships SET status_r = ?, updated_at = CURRENT_TIMESTAMP WHERE requester_id = ? AND addressee_id = ? AND status_r = ?',
                'accepted', requesterId, userId, 'pending'
            );

            if (result.changes === 0) {
                return reply.status(404).send({
                    error: 'Failed to update invitation'
                });
            }

            return reply.send({
                message: 'Invitation accepted successfully',
                invitation: {
                    requester_id: invitation.requester_id,
                    addressee_id: invitation.addressee_id,
                    status: 'accepted'
                }
            });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    });
}

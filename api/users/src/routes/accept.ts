import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.put<{
        Params: { token: string };
    }>('/api/invitations/:token/accept', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    token: { type: 'string' }
                },
                required: ['token']
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
                410: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { token } = request.params;
        const addressee_id = request.user?.id;

        try {
            const invitation = await server.db.get(
                'SELECT * FROM relationships WHERE invitation_token = ? AND status = ?',
                token, 'pending'
            );

            if (!invitation) {
                return reply.status(404).send({
                    error: 'Invitation not found or already processed'
                });
            }

            if (invitation.addressee_id !== addressee_id) {
                return reply.status(403).send({
                    error: 'Not authorized to accept this invitation'
                });
            }

            const result = await server.db.run(
                'UPDATE relationships SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE invitation_token = ? AND status = ?',
                'accepted', token, 'pending'
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


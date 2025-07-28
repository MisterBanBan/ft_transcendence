import {FastifyInstance} from "fastify";
import {BlockUserBody, UserParams} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.post<{
        Body: { invitation_token: string };
    }>('/api/invitations/block', {
        preHandler: [server.authenticate],
        schema: {
            body: {
                type: 'object',
                properties: {
                    invitation_token: { type: 'string' }
                },
                required: ['invitation_token']
            }
        }
    }, async (request, reply) => {
        const blocker_id = request.user?.id;
        const { invitation_token } = request.body;

        try {
            const invitation = await server.db.get(
                'SELECT requester_id, addressee_id, status FROM relationships WHERE invitation_token = ? AND status = ?',
                invitation_token, 'pending'
            );

            if (!invitation) {
                return reply.status(404).send({ error: 'Invitation not found or already processed' });
            }

            const blocked_user_id = invitation.requester_id === blocker_id
                ? invitation.addressee_id
                : invitation.requester_id;

            // Prevent self-blocking
            if (blocker_id === blocked_user_id) {
                return reply.status(400).send({ error: 'Cannot block yourself' });
            }

            await server.db.run(
                'UPDATE relationships SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE invitation_token = ?',
                'blocked', invitation_token
            );

            return reply.status(200).send({
                message: 'User blocked successfully',
                blocked_relationship: {
                    invitation_token,
                    requester_id: blocker_id,
                    addressee_id: blocked_user_id,
                    status: 'blocked'
                }
            });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

import {FastifyInstance} from "fastify";
import {RequesterParams} from "../../types/request.js";

export default async function (server: FastifyInstance) {
    server.put<{
        Params: RequesterParams;
    }>('/invitations/:requesterId/accept', {
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
                        message: { type: 'string' }
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
        const { requesterId: requester_id } = request.params;
        // In a real app, get from authentication middleware
        const addressee_id = request.headers['user-id'] as string;

        try {
            const result = await server.db.run(
                'UPDATE relationships SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE requester_id = ? AND addressee_id = ? AND status = ?',
                'accepted', requester_id, addressee_id, 'pending'
            );

            if (result.changes === 0) {
                return reply.status(404).send({ error: 'Invitation not found' });
            }

            return reply.send({ message: 'Invitation accepted' });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

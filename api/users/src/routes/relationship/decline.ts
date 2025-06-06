import {FastifyInstance} from "fastify";
import {RequesterParams} from "../../types/request.js";

export default async function (server: FastifyInstance) {
    server.delete<{
        Params: RequesterParams;
    }>('/api/invitations/:requesterId/decline', {
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
                }
            }
        }
    }, async (request, reply) => {
        const { requesterId: requester_id } = request.params;
        const addressee_id = request.headers['user-id'] as string;

        try {
            await server.db.run(
                'DELETE FROM relationships WHERE requester_id = ? AND addressee_id = ? AND status = ?',
                requester_id, addressee_id, 'pending'
            );

            return reply.send({ message: 'Invitation declined' });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

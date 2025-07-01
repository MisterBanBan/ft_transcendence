import {FastifyInstance} from "fastify";
import {UnblockUserBody, UserParams} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.delete<{
        Params: UserParams;
        Body: UnblockUserBody;
    }>('/api/users/:userId/unblockUser', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    userId: { type: 'string' }
                },
                required: ['userId']
            },
            body: {
                type: 'object',
                properties: {
                    blocked_user_id: { type: 'string' }
                },
                required: ['blocked_user_id']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        unblocked_relationship: {
                            type: 'object',
                            properties: {
                                requester_id: { type: 'string' },
                                addressee_id: { type: 'string' },
                                previous_status: { type: 'string' }
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
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { userId: unblocker_id } = request.params;
        const { blocked_user_id } = request.body;

        console.log('Unblocking user:', blocked_user_id, 'by user:', unblocker_id);

        try {
            const unblockerExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                unblocker_id
            );
            const blockedUserExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                blocked_user_id
            );

            if (!unblockerExists || !blockedUserExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            if (unblocker_id === blocked_user_id) {
                return reply.status(400).send({ error: 'Cannot unblock yourself' });
            }

            const existingBlockedRelation = await server.db.get(
                'SELECT * FROM relationships WHERE requester_id = ? AND addressee_id = ? AND status = ?',
                unblocker_id, blocked_user_id, 'blocked'
            );

            if (!existingBlockedRelation) {
                return reply.status(404).send({ error: 'No blocked relationship found' });
            }

            await server.db.run(
                'DELETE FROM relationships WHERE requester_id = ? AND addressee_id = ? AND status = ?',
                unblocker_id, blocked_user_id, 'blocked'
            );

            return reply.status(200).send({
                message: 'User unblocked successfully',
                unblocked_relationship: {
                    requester_id: existingBlockedRelation.requester_id,
                    addressee_id: existingBlockedRelation.addressee_id,
                    previous_status: existingBlockedRelation.status
                }
            });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

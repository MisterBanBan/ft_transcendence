import {FastifyInstance} from "fastify";
import {InviteBody, UserParams} from "../../types/request.js";

export default async function (server: FastifyInstance) {
    server.post<{
        Params: UserParams;
        Body: InviteBody;
    }>('/api/users/:userId/invite', {
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
                    addressee_id: { type: 'string' }
                },
                required: ['addressee_id']
            },
            response: {
                201: {
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
                409: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { userId: requester_id } = request.params;
        const { addressee_id } = request.body;

        try {
            // Check if both users exist
            const requesterExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                requester_id
            );
            const addresseeExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                addressee_id
            );

            if (!requesterExists || !addresseeExists) {
                return reply.status(404).send({ error: 'User not found' });
            }

            // Prevent self-invitation
            if (requester_id === addressee_id) {
                return reply.status(400).send({ error: 'Cannot invite yourself' });
            }

            // Check if relationship already exists
            const existingRelation = await server.db.get(
                'SELECT * FROM relationships WHERE requester_id = ? AND addressee_id = ?',
                requester_id, addressee_id
            );

            if (existingRelation) {
                return reply.status(409).send({ error: 'Invitation already exists' });
            }

            // Create the invitation
            await server.db.run(
                'INSERT INTO relationships (requester_id, addressee_id, status) VALUES (?, ?, ?)',
                requester_id, addressee_id, 'pending'
            );

            return reply.status(201).send({
                message: 'Invitation sent successfully',
                invitation: {
                    requester_id,
                    addressee_id,
                    status: 'pending'
                }
            });

        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

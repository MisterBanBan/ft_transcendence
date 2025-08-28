import {FastifyInstance, FastifyRequest} from "fastify";
import {InviteBody} from "../types/request.js";

export default async function (server: FastifyInstance) {
    server.post<{
        Body: InviteBody;
    }>('/api/users/invite', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    addressee_username: { type: 'string' }
                },
                required: ['addressee_username']
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
                                username: { type: 'string' },
                                status: { type: 'string' }
                            }
                        }
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
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
    }, async (request: FastifyRequest, reply) => {
        const requester_id = request.currentUser?.id;
        const { addressee_username } = request.body as { addressee_username: string };

        if (!requester_id) {
            return reply.status(401).send({ error: 'User not authenticated' });
        }

        try {
            const addresseeUser = await server.db.get(
                'SELECT id, username FROM users WHERE username = ?',
                addressee_username
            );

            if (!addresseeUser) {
                return reply.status(404).send({
                    error: 'User not found'
                });
            }

            const addressee_id = addresseeUser.id;

            if (requester_id.toString() === addressee_id.toString()) {
                return reply.status(400).send({ error: 'Cannot invite yourself' });
            }

            const requesterExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                requester_id
            );

            if (!requesterExists) {
                return reply.status(404).send({ error: 'Requester not found' });
            }

            const existingFriendship = await server.db.get(
                `SELECT * FROM relationships 
                 WHERE ((requester_id = ? AND addressee_id = ?) 
                    OR (requester_id = ? AND addressee_id = ?)) 
                    AND status_r = 'accepted'`,
                requester_id, addressee_id, addressee_id, requester_id
            );
            
            if (existingFriendship) {
                return reply.status(409).send({ error: 'User is already your friend' });
            }

            const existingRelation = await server.db.get(
                'SELECT * FROM relationships WHERE requester_id = ? AND addressee_id = ?',
                requester_id, addressee_id
            );

            if (existingRelation) {
                return reply.status(409).send({ error: 'Invitation already exists' });
            }

            await server.db.run(
                'INSERT INTO relationships (requester_id, addressee_id, status_r) VALUES (?, ?, ?)',
                requester_id, addressee_id, 'pending'
            );

            return reply.status(201).send({
                message: 'Invitation sent successfully',
                invitation: {
                    requester_id,
                    username: addressee_username,
                    status: 'pending'
                }
            });

        } catch (error) {
            console.error('Invite error:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

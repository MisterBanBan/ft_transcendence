import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/userService.js';

interface ProfileParams {
    userId: string;
}

export default async function (fastify: FastifyInstance) {
    const userService = new UserService(fastify.db);

    // Get user profile with stats and match history
    fastify.get<{ Params: ProfileParams }>('/user/:userId/profile', async (request: FastifyRequest<{ Params: ProfileParams }>, reply: FastifyReply) => {
        try {
            const { userId } = request.params;

            const profile = await userService.getUserProfile(userId);

            if (!profile) {
                return reply.status(404).send({
                    error: 'User not found'
                });
            }

            return reply.send({
                success: true,
                data: profile
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    });

    // Get detailed match history with pagination
    fastify.get<{
        Params: ProfileParams;
        Querystring: { page?: number; limit?: number }
    }>('/user/:userId/matches', async (request, reply) => {
        try {
            const { userId } = request.params;
            const { page = 1, limit = 10 } = request.query;

            const offset = (page - 1) * limit;
            const matches = await userService.getUserMatches(userId, limit);

            return reply.send({
                success: true,
                data: {
                    matches,
                    pagination: {
                        page,
                        limit,
                        hasMore: matches.length === limit
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching match history:', error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    });

    // Update user status
    fastify.post<{
        Params: ProfileParams;
        Body: { status: 'offline' | 'online' | 'in_game' }
    }>('/user/:userId/status', async (request, reply) => {
        try {
            const { userId } = request.params;
            const { status } = request.body;

            await fastify.db.run(
                'UPDATE users SET status = ?, last_activity = CURRENT_TIMESTAMP WHERE id = ?',
                [status, userId]
            );

            // Broadcast status change via WebSocket
            fastify.broadcastToAll({
                type: 'user_status_change',
                userId,
                status
            }, userId);

            return reply.send({
                success: true,
                message: 'Status updated successfully'
            });
        } catch (error) {
            console.error('Error updating user status:', error);
            return reply.status(500).send({
                error: 'Internal server error'
            });
        }
    });
}

import { FastifyInstance, FastifyRequest } from 'fastify';

interface ProfileParams {
    userId: string;
}

export default async function (server: FastifyInstance) {

    server.get<{
        Params: ProfileParams
    }>('/api/user/:userId/profile', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                username: { type: 'string' },
                                status: { type: 'string' },
                                totalGames: { type: 'number' },
                                wins: { type: 'number' },
                                losses: { type: 'number' },
                                winrate: { type: 'string' }
                            }
                        }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: ProfileParams }>, reply) => {
        try {
            const { userId } = request.params;
            console.log('Fetching profile for userId:', userId);

            const user = await server.db.get(
                'SELECT id, username, avatar_url, status, last_activity FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found'
                });
            }

            let stats = await server.db.get(
                'SELECT * FROM user_stats WHERE user_id = ?',
                [userId]
            );

            if (!stats) {
                await server.db.run(
                    'INSERT INTO user_stats (user_id) VALUES (?)',
                    [userId]
                );
                stats = await server.db.get(
                    'SELECT * FROM user_stats WHERE user_id = ?',
                    [userId]
                );
            }

            const winRate = stats.total_games > 0 ?
                Math.round((stats.wins / stats.total_games) * 100) : 0;

            const profile = {
                username: user.username,
                status: user.status,
                totalGames: stats.total_games || 0,
                wins: stats.wins || 0,
                losses: stats.losses || 0,
                winrate: `${winRate}%`
            };

            console.log('Profile data:', profile);

            return reply.send({
                success: true,
                data: profile
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });

    server.get<{
        Params: ProfileParams;
        Querystring: { page?: number; limit?: number }
    }>('/api/user/:userId/matches', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                matches: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            player1: { type: 'string' },
                                            player2: { type: 'string' },
                                            score1: { type: 'number' },
                                            score2: { type: 'number' },
                                            date: { type: 'string' },
                                            gameType: { type: 'string' }
                                        }
                                    }
                                },
                                pagination: {
                                    type: 'object',
                                    properties: {
                                        page: { type: 'number' },
                                        limit: { type: 'number' },
                                        hasMore: { type: 'boolean' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (request: FastifyRequest<{
        Params: ProfileParams;
        Querystring: { page?: number; limit?: number }
    }>, reply) => {
        try {
            const { userId } = request.params;
            const { page = 1, limit = 10 } = request.query;
            console.log('Fetching matches for userId:', userId);

            const matches = await server.db.all(`
                SELECT
                    m.id,
                    m.player1_id,
                    m.player2_id,
                    m.winner_id,
                    m.player1_score,
                    m.player2_score,
                    m.game_type,
                    m.completed_at,
                    u1.username as player1,
                    u2.username as player2
                FROM matches m
                         JOIN users u1 ON m.player1_id = u1.id
                         JOIN users u2 ON m.player2_id = u2.id
                WHERE (m.player1_id = ? OR m.player2_id = ?)
                  AND m.completed_at IS NOT NULL
                ORDER BY m.completed_at DESC
                LIMIT ?
            `, [userId, userId, limit]);

            const formattedMatches = matches.map(match => ({
                player1: match.player1,
                player2: match.player2,
                score1: match.player1_score,
                score2: match.player2_score,
                date: match.completed_at,
                gameType: match.game_type || 'online'
            }));

            console.log('Formatted matches:', formattedMatches);

            return reply.send({
                success: true,
                data: {
                    matches: formattedMatches,
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
                success: false,
                error: 'Internal server error'
            });
        }
    });

    server.post<{
        Params: ProfileParams;
        Body: { status: 'offline' | 'online' | 'in_game' }
    }>('/api/user/:userId/status', {
        schema: {
            body: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: {
                        type: 'string',
                        enum: ['offline', 'online', 'in_game']
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, async (request: FastifyRequest<{
        Params: ProfileParams;
        Body: { status: 'offline' | 'online' | 'in_game' }
    }>, reply) => {
        try {
            const { userId } = request.params;
            const { status } = request.body;

            const validStatuses = ['offline', 'online', 'in_game'];
            if (!validStatuses.includes(status)) {
                return reply.status(400).send({
                    success: false,
                    error: 'Invalid status value'
                });
            }

            const userExists = await server.db.get(
                'SELECT id FROM users WHERE id = ?',
                [userId]
            );

            if (!userExists) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found'
                });
            }

            await server.db.run(
                'UPDATE users SET status = ?, last_activity = CURRENT_TIMESTAMP WHERE id = ?',
                [status, userId]
            );

            server.broadcastToAll({
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
                success: false,
                error: 'Internal server error'
            });
        }
    });

    server.get<{
        Params: ProfileParams
    }>('/api/user/:userId', {
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                username: { type: 'string' },
                                avatar_url: { type: 'string' },
                                status: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: ProfileParams }>, reply) => {
        try {
            const { userId } = request.params;

            const user = await server.db.get(
                'SELECT id, username, avatar_url, status FROM users WHERE id = ?',
                [userId]
            );

            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found'
                });
            }

            return reply.send({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
}

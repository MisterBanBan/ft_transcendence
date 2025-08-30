import { FastifyInstance, FastifyRequest } from 'fastify';

function formatDate(date: Date) {

    console.log(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}/${month}/${year}`
}

export default async function (server: FastifyInstance) {

    server.get<{
    }>('/api/users/userProfile', {
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
    }, async (request: FastifyRequest, reply) => {
        try {
            const userId = request.currentUser?.id;

            if (!userId) {
                return reply.status(401).send({
                    error: 'User not authenticated'
                });
            }

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
            Querystring: { page?: number; limit?: number }
        }>('/api/users/matches', {
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
            Querystring: { page?: number; limit?: number }
        }>, reply) => {
            try {
                const userId = request.currentUser?.id;
                const { page = 1, limit = 10 } = request.query;
    
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
    
                const formattedMatches = matches.map(match => {
                const dateObj = new Date(match.completed_at);
                const formattedDate = formatDate(dateObj);

                return {
                    player1: match.player1,
                    player2: match.player2,
                    score1: match.player1_score,
                    score2: match.player2_score,
                    date: formattedDate,
                    gameType: match.game_type || 'online'
                };
                });

    
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
        server.get<{
            Params: { userId: string };
        }>('/api/users/:userId/fullProfile', {
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
                                    status: { type: 'string' },
                                    totalGames: { type: 'number' },
                                    wins: { type: 'number' },
                                    losses: { type: 'number' },
                                    winrate: { type: 'string' },
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, async (request: FastifyRequest<{ Params: { userId: string } }>, reply) => {
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
        
                const stats = await server.db.get(
                    'SELECT total_games, wins, losses FROM user_stats WHERE user_id = ?',
                    [userId]
                );
        
                const winRate = stats?.total_games > 0
                    ? Math.round((stats.wins / stats.total_games) * 100)
                    : 0;
        
                const matches = await server.db.all(`
                    SELECT
                        m.player1_id,
                        m.player2_id,
                        m.player1_score as score1,
                        m.player2_score as score2,
                        m.completed_at as date,
                        m.game_type as gameType,
                        u1.username as player1,
                        u2.username as player2
                    FROM matches m
                    JOIN users u1 ON m.player1_id = u1.id
                    JOIN users u2 ON m.player2_id = u2.id
                    WHERE (m.player1_id = ? OR m.player2_id = ?)
                    ORDER BY m.completed_at DESC
                `, [userId, userId]);

                const formattedMatches = matches.map(match => {
                    const formattedDate = formatDate(new Date(match.date));

                    return {
                        player1: match.player1,
                        player2: match.player2,
                        score1: match.score1,
                        score2: match.score2,
                        date: formattedDate,
                        gameType: match.gameType || 'online'
                    };
                })
        
                return reply.send({
                    success: true,
                    data: {
                        ...user,
                        totalGames: stats?.total_games || 0,
                        wins: stats?.wins || 0,
                        losses: stats?.losses || 0,
                        winrate: `${winRate}%`,
                        matches: formattedMatches || []
                    }
                });

            } catch (error) {
                console.error('Error fetching full profile:', error);
                return reply.status(500).send({
                    success: false,
                    error: 'Internal server error'
                });
            }
        });
        
    server.get<{
    }>('/api/users/:userId', {
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
    }, async (request: FastifyRequest, reply) => {
        try {
            const userId = request.currentUser?.id;

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

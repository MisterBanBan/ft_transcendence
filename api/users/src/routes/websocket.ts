/* import { FastifyInstance, FastifyRequest } from "fastify";

interface StatusMessage {
    type: 'status_change' | 'heartbeat';
    status?: 'online' | 'offline' | 'in_game';
    userId: string;
}

export default async function (server: FastifyInstance) {
    const activeConnections = server.activeConnections;

    server.get('/api/users/ws/status/', {
        websocket: true
    }, (socket, request: FastifyRequest) => {
        let userId: string | undefined;

        socket.send(JSON.stringify({
            type: 'welcome',
            message: 'WebSocket connexion established',
            timestamp: new Date().toISOString()
        }));

        socket.on('message', async (message: Buffer) => {
            try {
                const data: StatusMessage = JSON.parse(message.toString());
                console.log('Data parsed:', data);

                if (data.type === 'status_change' && data.userId && data.status) {
                    userId = data.userId;
                    activeConnections.set(userId, { socket, userId });

                    const userExists = await server.db.get(
                        'SELECT id FROM users WHERE id = ?',
                        [userId]
                    );

                    if (!userExists) {
                        socket.send(JSON.stringify({
                            type: 'error',
                            message: `User ${userId} does not exist. Please create the user first.`
                        }));
                        return;
                    }

                    await server.db.run(
                        `UPDATE users SET
                            status = ?,
                            last_activity = datetime('now')
                         WHERE id = ?`,
                        [data.status, userId]
                    );

                    socket.send(JSON.stringify({
                        type: 'status_confirmed',
                        userId: data.userId,
                        status: data.status,
                        timestamp: new Date().toISOString()
                    }));

                    server.broadcastToAll({
                        type: 'status_update',
                        userId: data.userId,
                        status: data.status,
                        timestamp: new Date().toISOString()
                    }, userId);
                }

                if (data.type === 'heartbeat' && data.userId) {
                    userId = data.userId;
                    await server.db.run(
                        `UPDATE users SET last_activity = datetime('now') WHERE id = ?`,
                        [userId]
                    );

                    socket.send(JSON.stringify({
                        type: 'pong',
                        timestamp: new Date().toISOString()
                    }));
                }

            } catch (error) {
                if (error instanceof Error) {
                    //server.log.error('Error handling WebSocket message:', error);
                    socket.send(JSON.stringify({
                        type: 'error',
                        message: error.message,
                        timestamp: new Date().toISOString()
                    }));
                } else {
                    //server.log.error('Unknown error handling WebSocket message:', error);
                    socket.send(JSON.stringify({
                        type: 'error',
                        message: 'unknown error',
                        timestamp: new Date().toISOString()
                    }));
                }
            }
        });

        socket.on('close', async (code: any, reason: any) => {
            if (userId) {
                activeConnections.delete(userId);

                await server.db.run(
                    `UPDATE users SET
                                      status = 'offline',
                                      last_activity = datetime('now')
                     WHERE id = ?`,
                    [userId]
                );

                server.broadcastToAll({
                    type: 'status_update',
                    userId: userId,
                    status: 'offline',
                    timestamp: new Date().toISOString()
                });
            }
        });

        socket.on('error', (error: Error) => {
            //server.log.error(`WebSocket error for user ${userId}:`, error);
            if (userId) {
                activeConnections.delete(userId);
            }
        });
    });

    server.get('/api/users/ws/debug', async (request, reply) => {
        return reply.send({
            activeConnections: activeConnections.size,
            connections: Array.from(activeConnections.keys())
        });
    });

    server.get('/api/users/status', async (request, reply) => {
        try {
            const users = await server.db.all(
                `SELECT id, username, status, last_activity
                 FROM users
                 ORDER BY last_activity DESC`
            );

            return reply.send({
                message: 'User statuses retrieved successfully',
                users: users
            });
        } catch (error) {
            //server.log.error('Error fetching user statuses:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
 */
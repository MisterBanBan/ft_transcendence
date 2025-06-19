import { FastifyInstance, FastifyRequest } from "fastify";

interface StatusMessage {
    type: 'status_change' | 'heartbeat';
    status?: 'online' | 'offline' | 'in_game';
    userId: string;
}

export default async function (server: FastifyInstance) {
    const activeConnections = new Map<string, WebSocket>();

    server.get('/ws/status', {
        websocket: true
    }, (connection, request: FastifyRequest) => {
        let userId: string | undefined;

        connection.socket.on('message', async (message: Buffer) => {
            try {
                const data: StatusMessage = JSON.parse(message.toString());

                if (data.type === 'status_change' && data.userId && data.status) {
                    userId = data.userId;
                    activeConnections.set(userId, connection.socket);

                    await server.db.run(
                        `UPDATE users SET 
                         status = ?, 
                         last_activity = datetime('now')
                         WHERE id = ?`,
                        [data.status, userId]
                    );

                    const statusUpdate = {
                        type: 'status_update',
                        userId: data.userId,
                        status: data.status,
                        timestamp: new Date().toISOString()
                    };

                    activeConnections.forEach((socket, connectedUserId) => {
                        if (connectedUserId !== userId && socket.readyState === 1) {
                            socket.send(JSON.stringify(statusUpdate));
                        }
                    });

                    console.log(`User ${userId} status updated to: ${data.status}`);
                }

                if (data.type === 'heartbeat' && data.userId) {
                    userId = data.userId;
                    // update last_activity for the heartbeat
                    await server.db.run(
                        `UPDATE users SET last_activity = datetime('now') WHERE id = ?`,
                        [userId]
                    );
                }

            } catch (error) {
                server.log.error('Error handling WebSocket message:', error);
            }
        });

        connection.socket.on('close', async () => {
            if (userId) {
                console.log(`User ${userId} disconnected`);
                activeConnections.delete(userId);

                await server.db.run(
                    `UPDATE users SET 
                     status = 'offline', 
                     last_activity = datetime('now')
                     WHERE id = ?`,
                    [userId]
                );

                // Notif other users
                const statusUpdate = {
                    type: 'status_update',
                    userId: userId,
                    status: 'offline',
                    timestamp: new Date().toISOString()
                };

                activeConnections.forEach((socket) => {
                    if (socket.readyState === 1) {
                        socket.send(JSON.stringify(statusUpdate));
                    }
                });
            }
        });

        connection.socket.on('error', (error: Error) => {
            server.log.error(`WebSocket error for user ${userId}:`, error);
            if (userId) {
                activeConnections.delete(userId);
            }
        });
    });

    // Route for current status
    server.get('/api/users/status', async (request, reply) => {
        try {
            const users = await server.db.all(
                `SELECT id, username, status, last_activity 
                 FROM users 
                 WHERE status != 'offline' 
                 ORDER BY last_activity DESC`
            );

            return reply.send({
                message: 'User statuses retrieved successfully',
                users: users
            });
        } catch (error) {
            server.log.error('Error fetching user statuses:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

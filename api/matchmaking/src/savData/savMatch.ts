import { EndMatchBody } from ../types/fastify.d.js

async function savMatchStats(server: FastifyInstance, EndMatchBody: EndMatchBody) {
    try {
        const [player1, player2, winner] = await Promise.all([
            server.db.get('SELECT id, username FROM users WHERE id = ?', [EndMatchBody.player1_id]),
            server.db.get('SELECT id, username FROM users WHERE id = ?', [EndMatchBody.player2_id]),
            server.db.get('SELECT id, username FROM users WHERE id = ?', [EndMatchBody.winner_id])
        ]);

        if (!player1 || !player2) {
            return reply.status(400).send({
                success: false,
                error: 'One or more players not found'
            });
        }

        if (!winner) {
            return reply.status(400).send({
                success: false,
                error: 'Specified winner not found'
            });
        }

        if (EndMatchBody.winner_id !== EndMatchBody.player1_id && EndMatchBody.winner_id !== EndMatchBody.player2_id) {
            return reply.status(400).send({
                success: false,
                error: 'Winner must be one of the two match players'
            });
        }

        const completedAt = new Date().toISOString();

        await server.db.run(`
            INSERT INTO matches (
                id, player1_id, player2_id, winner_id,
                player1_score, player2_score, game_type, completed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            matchId,
            EndMatchBody.player1_id,
            EndMatchBody.player2_id,
            EndMatchBody.winner_id,
            EndMatchBody.player1_score,
            EndMatchBody.player2_score,
            EndMatchBody.game_type,
            completedAt
        ]);

        console.log('Match inserted with ID:', matchId);

        const statsUpdated = await updatePlayersStats(server, EndMatchBody.player1_id, EndMatchBody.player2_id, EndMatchBody.winner_id);

        console.log('Match processing completed successfully');

        return reply.status(201).send({
            success: true,
            data: {
                matchId: matchId,
                message: 'Match recorded and statistics updated',
                stats: statsUpdated
            }
        });

    } catch (error) {
        console.error('Error processing end of match:', error);
        return reply.status(500).send({
            success: false,
            error: 'Internal server error'
        });
    }
});

    async function updatePlayersStats(server: FastifyInstance, player1_id: string, player2_id: string, winner_id: string) {
        const players = [
            { id: player1_id, won: winner_id === player1_id },
            { id: player2_id, won: winner_id === player2_id }
        ];

        const results = { player1_updated: false, player2_updated: false };

        for (const player of players) {
            try {
                let stats = await server.db.get(
                    'SELECT * FROM user_stats WHERE user_id = ?',
                    [player.id]
                );

                if (!stats) {
                    await server.db.run(
                        'INSERT INTO user_stats (user_id, total_games, wins, losses) VALUES (?, 0, 0, 0)',
                        [player.id]
                    );
                }

                await server.db.run(`
                    UPDATE user_stats
                    SET
                        total_games = total_games + 1,
                        wins = wins + ?,
                        losses = losses + ?
                    WHERE user_id = ?
                `, [
                    player.won ? 1 : 0,
                    player.won ? 0 : 1,
                    player.id
                ]);

                if (player.id === player1_id) results.player1_updated = true;
                if (player.id === player2_id) results.player2_updated = true;

                console.log(`Stats updated for player ${player.id}: ${player.won ? 'WIN' : 'LOSS'}`);

            } catch (error) {
                console.error(`Error updating stats for player ${player.id}:`, error);
            }
        }

        return results;
    }
}

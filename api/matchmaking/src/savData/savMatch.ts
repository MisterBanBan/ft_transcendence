import { EndMatchBody } from "../utils/interface"
import {FastifyInstance} from "fastify";

export async function savMatchStats(server: FastifyInstance, EndMatchBody: EndMatchBody) {
    try {
        const [player1, player2, winner] = await Promise.all([
            server.userDb.get('SELECT id, username FROM users WHERE id = ?', [EndMatchBody.player1_id]),
            server.userDb.get('SELECT id, username FROM users WHERE id = ?', [EndMatchBody.player2_id]),
            server.userDb.get('SELECT id, username FROM users WHERE id = ?', [EndMatchBody.winner_id])
        ]);

        const completedAt = new Date().toISOString();

        await server.userDb.run(`
            INSERT INTO matches (
                player1_id, player2_id, winner_id,
                player1_score, player2_score, game_type, completed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            EndMatchBody.player1_id,
            EndMatchBody.player2_id,
            EndMatchBody.winner_id,
            EndMatchBody.player1_score,
            EndMatchBody.player2_score,
            EndMatchBody.game_type,
            completedAt
        ]);

        const statsUpdated = await updatePlayersStats(server, EndMatchBody.player1_id, EndMatchBody.player2_id, EndMatchBody.winner_id);

        console.log('Match processing completed successfully');

    } catch (error) {
        console.error('Error processing end of match:', error);
    }
}

async function updatePlayersStats(server: FastifyInstance, player1_id: string, player2_id: string, winner_id: string) {
    const players = [
        { id: player1_id, won: winner_id === player1_id },
        { id: player2_id, won: winner_id === player2_id }
    ];

    const results = { player1_updated: false, player2_updated: false };

    for (const player of players) {
        try {
            let stats = await server.userDb.get(
                'SELECT * FROM user_stats WHERE user_id = ?',
                [player.id]
            );

            if (!stats) {
                await server.userDb.run(
                    'INSERT INTO user_stats (user_id, total_games, wins, losses) VALUES (?, 0, 0, 0)',
                    [player.id]
                );
            }

            await server.userDb.run(`
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

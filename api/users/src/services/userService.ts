import {Database} from 'sqlite';
import {Match, User, UserProfile, UserStats} from '../types/user.js';

export class UserService {
    constructor(private db: Database) {}

    async getUserById(userId: string): Promise<User | null> {
        const user = await this.db.get(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        return user || null;
    }

    async getUserStats(userId: string): Promise<UserStats | null> {
        let stats = await this.db.get(
            'SELECT * FROM user_stats WHERE user_id = ?',
            [userId]
        );

        if (!stats) {
            await this.db.run(
                'INSERT INTO user_stats (user_id) VALUES (?)',
                [userId]
            );
            stats = await this.db.get(
                'SELECT * FROM user_stats WHERE user_id = ?',
                [userId]
            );
        }

        const winRate = stats.total_games > 0 ?
            Math.round((stats.wins / stats.total_games) * 100) : 0;

        return {
            ...stats,
            win_rate: winRate
        };
    }

    async getUserMatches(userId: string, limit: number = 10): Promise<Match[]> {
        return await this.db.all(`
            SELECT 
                m.*,
                CASE 
                    WHEN m.player1_id = ? THEN u2.username 
                    ELSE u1.username 
                END as opponent_username,
                CASE 
                    WHEN m.winner_id = ? THEN 'Won'
                    WHEN m.winner_id IS NULL THEN 'Draw'
                    ELSE 'Lost'
                END as result
            FROM matches m
            JOIN users u1 ON m.player1_id = u1.id
            JOIN users u2 ON m.player2_id = u2.id
            WHERE (m.player1_id = ? OR m.player2_id = ?) 
              AND m.completed_at IS NOT NULL
            ORDER BY m.completed_at DESC
            LIMIT ?
        `, [userId, userId, userId, userId, limit]);
    }

    async getUserProfile(userId: string): Promise<UserProfile | null> {
        const user = await this.getUserById(userId);
        if (!user) return null;

        const stats = await this.getUserStats(userId);
        const matches = await this.getUserMatches(userId);

        return {
            user,
            stats: stats!,
            matches
        };
    }

    async updateUserStats(userId: string, isWin: boolean, pointsScored: number, pointsConceded: number): Promise<void> {
        await this.db.run(`
            UPDATE user_stats 
            SET 
                total_games = total_games + 1,
                wins = wins + ?,
                losses = losses + ?,
                total_points_scored = total_points_scored + ?,
                total_points_conceded = total_points_conceded + ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `, [
            isWin ? 1 : 0,
            isWin ? 0 : 1,
            pointsScored,
            pointsConceded,
            userId
        ]);
    }
}

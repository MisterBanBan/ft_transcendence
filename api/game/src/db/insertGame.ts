import type { Database } from 'sqlite';

export async function insertGame(
    db: Database,
    winner_score: number,
    loser_score: number,
    winner: string,
    loser: string,
): Promise<number | undefined> {
    const result = await db.run(
        `INSERT INTO history (winner_score, loser_score, winner, loser)
     VALUES (?, ?, ?, ?)`,
        [winner_score, loser_score, winner, loser]
    );
    return result.lastID;
}
import type { Database } from 'sqlite';

export async function insertAuthentication(
    db: Database,
    username: string,
    email: string,
    hashedPassword: string,
    timestamp: number
): Promise<number | undefined> {
    const result = await db.run(
        `INSERT INTO auth (username, email, password, timestamp)
     VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, timestamp]
    );
    return result.lastID;
}
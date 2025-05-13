import type { Database } from 'sqlite';

export async function insertAuthentication(
    db: Database,
    username: string,
    email: string,
    hashedPassword: string,
    token: string
): Promise<number | undefined> {
    const result = await db.run(
        `INSERT INTO auth (username, email, password, token)
     VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, token]
    );
    return result.lastID;
}
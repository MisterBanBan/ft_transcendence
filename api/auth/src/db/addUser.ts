import type { Database } from 'sqlite';
import {User} from "../types/user.js";

export async function addUser(
    db: Database,
    user: User
): Promise<number | undefined> {
    const result = await db.run(
        `INSERT INTO auth (username, email, password, updatedAt)
     VALUES (?, ?, ?, ?)`,
        [user.username, user.email, user.password, user.updatedAt]
    );
    return result.lastID;
}
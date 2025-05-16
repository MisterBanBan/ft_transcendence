import type { Database } from 'sqlite';
import {User} from "../interface/user.js";

export async function addUser(
    db: Database,
    user: User
): Promise<number | undefined> {
    const result = await db.run(
        `INSERT INTO auth (username, password, updatedAt)
     VALUES (?, ?, ?)`,
        [user.username, user.password, user.updatedAt]
    );
    return result.lastID;
}
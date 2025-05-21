import type { Database } from 'sqlite';
import {User} from "../interface/user.js";

export async function addUser(
	db: Database,
	user: User
): Promise<number | undefined> {
	const result = await db.run(
		`INSERT INTO auth (username, password, provider, provider_id, updatedAt)
VALUES (?, ?, ?, ?, ?)`,
		[user.username, user.password, user.provider, user.provider_id, user.updatedAt]
	);
	return result.lastID;
}
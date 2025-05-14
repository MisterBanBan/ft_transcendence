import type {Database} from 'sqlite';
import {User} from "../types/user.js";

export async function getUserByUsername(
	db: Database,
	username: string,
): Promise<User | undefined> {
	return await db.get<User>(
		`SELECT * FROM auth WHERE username = ?`,
		[username]
	);
}
import type {Database} from 'sqlite';
import {User} from "../interface/user.js";

export async function getUserByUsername(
	db: Database,
	username: string,
): Promise<User | undefined> {

	return await db.get<User>(
		`SELECT id, username, password, tfa, provider, provider_id, updatedAt FROM auth WHERE username = ?`,
		[username]
	);
}

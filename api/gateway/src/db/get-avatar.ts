import type {Database} from 'sqlite';
import {User} from "../interface/user.js";

export async function getAvatar(
	db: Database,
	username: string,
): Promise<User | undefined> {

	return await db.get<User>(
		`SELECT avatar_url FROM users WHERE username = ?`,
		[username]
	);
}

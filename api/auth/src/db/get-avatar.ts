import type {Database} from 'sqlite';
import {User} from "../interface/user.js";

export async function getAvatar(
	usersDb: Database,
	username: string,
): Promise<User | undefined> {

	return await usersDb.get<User>(
		`SELECT avatar_url FROM users WHERE username = ?`,
		[username]
	);
}

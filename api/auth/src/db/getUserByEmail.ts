import type {Database} from 'sqlite';
import {User} from "../types/user.js";

export async function getUserByEmail(
	db: Database,
	email: string,
): Promise<User | undefined> {
	return await db.get<User>(
		`SELECT * FROM auth WHERE email = ?`,
		[email]
	);
}
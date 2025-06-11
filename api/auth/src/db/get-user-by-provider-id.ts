import type {Database} from 'sqlite';
import {User} from "../interface/user.js";

export async function getUserByProviderId(
	db: Database,
	provider_id: string,
): Promise<User | undefined> {

	return await db.get<User>(
		`SELECT id, username, password, tfa, provider, provider_id, updatedAt FROM auth WHERE provider_id = ?`,
		[provider_id]
	);
}

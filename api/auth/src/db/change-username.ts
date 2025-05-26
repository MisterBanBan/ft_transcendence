import type { Database } from 'sqlite';
import {getUserByUsername} from "./get-user-by-username.js";

export async function changeUsername(
	db: Database,
	id: number,
	newUsername: string,
) {
	await db.run(
		`UPDATE auth SET username = ? WHERE id = ?`,
		newUsername,
		id,
	);
}
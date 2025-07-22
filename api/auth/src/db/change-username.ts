import type { Database } from 'sqlite';

export async function changeUsername(
	db: Database,
	usersDb: Database,
	id: number,
	newUsername: string,
): Promise<number> {

	const timestamp = Date.now();

	await db.run(
		`UPDATE auth SET username = ?, updatedAt = ? WHERE id = ?`,
		newUsername,
		timestamp,
		id,
	);

	await usersDb.run(
		`UPDATE users SET username = ? WHERE id = ?`,
		newUsername,
		id,
	);

	return timestamp;
}
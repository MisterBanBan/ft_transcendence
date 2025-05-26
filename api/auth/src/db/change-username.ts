import type { Database } from 'sqlite';

export async function changeUsername(
	db: Database,
	id: number,
	newUsername: string,
) {
	await db.run(
		`UPDATE auth SET username = ?, updatedAt = ? WHERE id = ?`,
		newUsername,
		Date.now(),
		id,
	);
}
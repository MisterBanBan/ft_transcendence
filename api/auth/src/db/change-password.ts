import type { Database } from 'sqlite';

export async function changePassword(
	db: Database,
	id: number,
	newPassword: string,
): Promise<number> {

	const timestamp = Date.now();

	await db.run(
		`UPDATE auth SET password = ?, updatedAt = ? WHERE id = ?`,
		newPassword,
		timestamp,
		id,
	);

	return timestamp;
}
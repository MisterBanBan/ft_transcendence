import type { Database } from 'sqlite';

export async function remove2fa(
	db: Database,
	username: string,
): Promise<number> {

	const timestamp = Date.now();

	await db.run(
		`UPDATE auth SET tfa = null, updatedAt = ? WHERE username = ?`,
		timestamp,
		username
	);

	return timestamp;
}
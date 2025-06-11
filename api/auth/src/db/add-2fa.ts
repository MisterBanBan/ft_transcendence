import type { Database } from 'sqlite';

export async function add2fa(
	db: Database,
	username: string,
	formattedKey: string,
): Promise<number> {

	const timestamp = Date.now();

	await db.run(
		`UPDATE auth SET tfa = ?, updatedAt = ? WHERE username = ?`,
		formattedKey,
		timestamp,
		username
	);

	return timestamp
}
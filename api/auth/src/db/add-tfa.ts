import type { Database } from 'sqlite';

export async function addTfa(
	db: Database,
	username: string,
	formattedKey: string,
): Promise<string | undefined> {
	await db.run(
		`UPDATE auth SET tfa = ? WHERE username = ?`,
		formattedKey,
		username
	);
	return formattedKey;
}
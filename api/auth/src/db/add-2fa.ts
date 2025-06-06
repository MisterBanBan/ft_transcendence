import type { Database } from 'sqlite';

export async function add2fa(
	db: Database,
	username: string,
	formattedKey: string,
) {
	await db.run(
		`UPDATE auth SET tfa = ? WHERE username = ?`,
		formattedKey,
		username
	);
}
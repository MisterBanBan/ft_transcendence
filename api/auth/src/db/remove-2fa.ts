import type { Database } from 'sqlite';

export async function remove2fa(
	db: Database,
	username: string,
) {
	await db.run(
		`UPDATE auth SET tfa = null WHERE username = ?`,
		username
	);
}
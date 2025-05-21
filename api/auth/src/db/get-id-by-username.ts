import type {Database} from 'sqlite';

export async function getIdByUsername(
	db: Database,
	username: string,
): Promise<number | undefined> {
	return await db.get<number>(
		`SELECT id FROM auth WHERE username = ?`,
		[username]
	);
}
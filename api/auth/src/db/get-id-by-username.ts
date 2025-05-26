import type {Database} from 'sqlite';

export async function getIdByUsername(
	db: Database,
	username: string,
): Promise<number | undefined> {
	return (await db.get<{ id: number }>(
		`SELECT id FROM auth WHERE username = ?`,
		[username]
	))?.id;
}
import type {Database} from 'sqlite';

export async function getAvatar(
	db: Database,
	username: string,
): Promise<string | undefined> {

	return (await db.get<{ avatar_url: string }>(
		`SELECT avatar_url FROM users WHERE username = ?`,
		[username]
	))?.avatar_url;
}

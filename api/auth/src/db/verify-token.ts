import type {Database} from 'sqlite';
import {User} from "../interface/user.js";
import {TokenPayload} from "../interface/token-payload.js";

export async function verifyToken(
	db: Database,
	decodedToken: TokenPayload,
): Promise<boolean> {
	 const user = await db.get<User>(
		`SELECT * FROM auth WHERE username = ?`,
		[decodedToken.username]
	);

	 return !!(user && user.username === decodedToken.username
		 && user.updatedAt === decodedToken.updatedAt);
}
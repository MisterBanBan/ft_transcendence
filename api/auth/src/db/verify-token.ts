import type {Database} from 'sqlite';
import {User} from "../interface/user.js";
import {TokenPayload} from "../interface/token-payload.js";
import {getIdByUsername} from "./get-id-by-username.js";
import {type} from "node:os";

export async function verifyToken(
	db: Database,
	decodedToken: TokenPayload,
): Promise<boolean> {
	 const user = await db.get<User>(
		`SELECT * FROM auth WHERE username = ?`,
		[decodedToken.username]
	);
	return !!(user
		&& await getIdByUsername(db, user.username) === decodedToken.id
		&& user.username === decodedToken.username
		&& user.updatedAt === decodedToken.updatedAt
		&& user.provider === decodedToken.provider
		&& user.provider_id === decodedToken.provider_id);
}
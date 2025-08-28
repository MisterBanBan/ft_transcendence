import type {Database} from 'sqlite';
import {User} from "../interface/user.js";
import {TokenPayload} from "../interface/token-payload.js";

export async function verifyToken(
	db: Database,
	decodedToken: TokenPayload,
) {
	 const user = await db.get<User>(
		`SELECT id, username, updatedAt, provider, provider_id FROM auth WHERE username = ?`,
		[decodedToken.username]
	);

	if (!user) throw Error("User not found");

	if (
		user.id != decodedToken.id
		|| user.username != decodedToken.username
		|| user.updatedAt != decodedToken.updatedAt
		|| user.provider != decodedToken.provider
		|| user.provider_id != decodedToken.provider_id) {
		throw Error("Invalid token");
	}
}
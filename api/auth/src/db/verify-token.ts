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

	//  console.log("verify token", decodedToken);
	//
	// console.log(user);
	// if (user)
	// {
	// 	console.log(await getIdByUsername(db, user.username) == decodedToken.id);
	// 	console.log(user.username == decodedToken.username, user.username, decodedToken.username);
	// 	console.log(user.updatedAt == decodedToken.updatedAt, user.updatedAt, decodedToken.updatedAt);
	// 	console.log(user.provider == decodedToken.provider, user.provider, decodedToken.provider);
	// 	console.log(user.provider_id == decodedToken.provider_id, user.provider_id, decodedToken.provider_id);
	// 	console.log(user.provider_id, decodedToken.provider_id, typeof user.provider_id, typeof decodedToken.provider_id);
	// }

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
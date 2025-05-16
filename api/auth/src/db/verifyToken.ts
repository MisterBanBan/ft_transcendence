import type {Database} from 'sqlite';
import {User} from "../types/user.js";
import {TokenPayload} from "../types/tokenPayload.js";

export async function verifyToken(
    db: Database,
    decodedToken: TokenPayload,
): Promise<boolean> {
     const user = await db.get<User>(
        `SELECT * FROM auth WHERE username = ?`,
        [decodedToken.username]
    );

     console.log("User: ", user);
     console.log("Decoded: ", decodedToken);

     return !!(user && user.username === decodedToken.username
         && user.updatedAt === decodedToken.updatedAt);
}
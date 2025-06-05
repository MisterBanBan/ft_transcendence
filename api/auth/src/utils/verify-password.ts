import argon2 from "argon2";
import {User} from "../interface/user.js";

export async function verifyPassword(user: User, password: string): Promise<boolean> {
	return await argon2.verify(user.password!, password, { secret: Buffer.from(process.env.ARGON_SECRET!) })
}
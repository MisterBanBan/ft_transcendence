import { TokenPayload } from "../interface/token-payload.js";
import {FastifyInstance, FastifyReply} from "fastify";
import {verifyToken} from "../db/verify-token.js";

export async function decodeToken(server: FastifyInstance, token: string, reply: FastifyReply): Promise<TokenPayload | undefined> {

	const cookieOpts = {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: true
	};

	let decodedToken: TokenPayload;
	try {
		decodedToken = server.jwt.verify(token);
		await verifyToken(server.authDb, decodedToken);
	} catch {
		reply.clearCookie("token", cookieOpts);
		return undefined;
	}

	return decodedToken;
}
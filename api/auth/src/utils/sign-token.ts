import {TokenPayload} from "../interface/token-payload.js";
import {FastifyInstance} from "fastify";

export async function signToken(server: FastifyInstance, payload: TokenPayload): Promise<string> {
	return server.jwt.sign(payload, {
		noTimestamp: true,
		expiresIn: 2_592_000
	});
}
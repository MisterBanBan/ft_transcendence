import {create2FASessions} from "../routes/2fa/create.js";
import {remove2FASessions} from "../routes/2fa/remove.js";
import {FastifyReply} from "fastify";

const oauthSessions = new Map<string, { username: string, type: string, eat: number, timeout: NodeJS.Timeout }>

export async function createOAuthEntry(token: string, username: string, type: string, ttl: number, eat: number) {

	const timeout = setTimeout(() => {
		const session = oauthSessions.get(token);
		if (session) {
			oauthSessions.delete(token);
		}
	}, ttl);

	oauthSessions.set(token, { username: username, type: type, eat: eat, timeout: timeout });
}

export async function handleRelog(state: string, reply: FastifyReply) {
	if (state.startsWith("relogin_")) {
		const id = state.split('_')[1];
		if (!id) {
			return reply.status(400).send({ error: "Missing id" });
		}

		const oauthSession = oauthSessions.get(id);
		if (!oauthSession) {
			return reply.status(401).send({ error: "Invalid or expired session" });
		}

		oauthSessions.delete(id);
		let key;
		let redirectUrl;
		switch (oauthSession.type) {
			case "create2FA": key = create2FASessions.get(oauthSession.username); redirectUrl = "/game?setting=toggle-2fa#settings"; break;
			case "remove2FA": key = remove2FASessions.get(oauthSession.username); redirectUrl = "/game?setting=toggle-2fa#settings"; break;
			default: return reply.status(400).send({ error: "Invalid OAuth Relog request" });
		}

		if (!key) {
			return reply.status(401).send({error: "Invalid 2FA session"});
		}

		key.relogin = false;
		return reply.status(303).redirect(redirectUrl);
	}
}
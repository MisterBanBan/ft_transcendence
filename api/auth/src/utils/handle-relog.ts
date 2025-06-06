import {create2FASessions} from "../routes/2fa/create.js";
import {remove2FASessions} from "../routes/2fa/remove.js";
import {FastifyReply} from "fastify";

const oauthSessions = new Map<string, { username: string, type: string, eat: number }>

export async function createOAuthEntry(token: string, username: string, type: string) {
	oauthSessions.set(token, { username: username, type: type, eat: Date.now() + (2 * 60 * 1000) });
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
			case "create2FA": key = create2FASessions.get(oauthSession.username); redirectUrl = "/2fa/create"; break;
			case "remove2FA": key = remove2FASessions.get(oauthSession.username); redirectUrl = "/2fa/remove"; break;
			default: return reply.status(400).send({ error: "Invalid OAuth Relog request" });
		}

		if (!key) {
			return reply.status(401).send({error: "Invalid 2FA session"});
		}

		key.relogin = false;
		return reply.status(303).redirect(redirectUrl);
	}
}
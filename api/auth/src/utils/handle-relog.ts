import {create2FASessions} from "../routes/2fa/create.js";
import {remove2FASessions} from "../routes/2fa/remove.js";
import {FastifyReply} from "fastify";
import {User} from "../interface/user.js";

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

export function returnPopup(reply: FastifyReply, message: string) {
	return reply.status(302).redirect(`https://${process.env.HOSTNAME}:8443/game?popup=${encodeURI(message)}#settings`)
}

export async function handleRelog(user: User, state: string, reply: FastifyReply) {
	if (state.startsWith("relogin_")) {
		const id = state.split('_')[1];
		if (!id) {
			return returnPopup(reply, "Missing state token");
		}

		const oauthSession = oauthSessions.get(id);
		if (!oauthSession) {
			return returnPopup(reply, "Invalid or expired session");
		}

		if (user.username !== oauthSession.username) {
			return returnPopup(reply, "Invalid account");
		}

		oauthSessions.delete(id);
		let key;
		let redirectUrl;
		switch (oauthSession.type) {
			case "create2FA": key = create2FASessions.get(oauthSession.username); redirectUrl = "/game?setting=toggle-2fa#settings"; break;
			case "remove2FA": key = remove2FASessions.get(oauthSession.username); redirectUrl = "/game?setting=toggle-2fa#settings"; break;
			default: return returnPopup(reply, "Invalid OAuth Relog request");
		}

		if (!key) {
			return returnPopup(reply, "Invalid 2FA session");
		}

		key.relogin = false;
		return reply.status(303).redirect(redirectUrl);
	}
}
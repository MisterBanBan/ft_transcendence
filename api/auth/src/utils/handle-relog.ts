import {oauthRelogin, tempKeys} from "../routes/2fa/create.js";
import {FastifyReply} from "fastify";

export async function handleRelog(state: string, reply: FastifyReply) {
	if (state.startsWith("relogin_")) {
		const id = state.split('_')[1];
		if (!id) {
			return reply.status(400).send({ error: "Missing id" });
		}

		const oauthSession = oauthRelogin.get(id);
		if (!oauthSession) {
			return reply.status(401).send({ error: "Invalid or expired session" });
		}

		oauthRelogin.delete(id);
		const key = tempKeys.get(oauthSession.username);
		if (!key) {
			return reply.status(401).send({error: "Invalid session"});
		}

		key.relogin = false;
		return reply.status(303).redirect("/2fa/create");
	}
}
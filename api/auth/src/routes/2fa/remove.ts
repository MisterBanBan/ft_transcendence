import {FastifyInstance} from "fastify";
import authenticator from "authenticator";
import {User} from "../../interface/user.js";
import {verifyPassword} from "../../utils/verify-password.js";
import {remove2fa} from "../../db/remove-2fa.js";
import {createOAuthEntry} from "../../utils/handle-relog.js";

export const remove2FASessions = new Map<string, {token?:string, relogin: boolean, eat?: number, tries?: number}>();

export default async function (server: FastifyInstance) {

	server.get('/api/auth/2fa/remove', async function (request, reply) {

		const user = request.currentUser! as User;

		if (!user.tfa) {
			return reply.status(401).send({ error: "2FA already disabled" });
		}

		if (user.provider == "local" || (user.provider != "local" && remove2FASessions.get(user.username)?.relogin === false)) {

			remove2FASessions.set(user.username, {relogin: false, eat: Date.now() + (2 * 60 * 1000), tries: 5});

			return reply.status(200).send({ message: "Session created" });
		}
		else {

			const token = crypto.randomUUID();

			remove2FASessions.set(user.username,	 {token: token, relogin: false});
			await createOAuthEntry(token, user.username, "remove2FA");

			if (user.provider == "google") {
				return reply.status(202).header('Location', "https://accounts.google.com/o/oauth2/v2/auth?" +
					"client_id=570055045570-c95opdokftohj6c4l7u9t7b46bpmnrkl.apps.googleusercontent.com&" +
					"redirect_uri=https%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fcallback%2Fgoogle&" +
					"response_type=code&scope=profile%20email&" +
					"access_type=offline&" +
					"include_granted_scopes=true&" +
					"prompt=login&" +
					"max_age=0&" +
					`state=relogin_${token}`).send({});
			} else if (user.provider == "42") {
				return reply.status(202).header('Location', "https://api.intra.42.fr/oauth/authorize?" +
					"client_id=u-s4t2ud-04dc53dfa151b3c595dfa8d2ad750d48dfda6fffd8848b0e4b1d438b00306b10&" +
					"redirect_uri=https%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fcallback%2F42&" +
					"response_type=code&" +
					`state=relogin_${token}`).send({});
			}
		}
	});

	server.post('/api/auth/2fa/remove', async function (request, reply) {
		const { code, password } = request.body as { code: string; password?: string };
		const user = request.currentUser! as User;

		if (!user.tfa) {
			return reply.status(401).send({ error: "2FA already disabled" });
		}

		const key = remove2FASessions.get(user.username);

		if (!key || !key.eat || !key.tries || key.eat < Date.now()) {
			if (key) {
				remove2FASessions.delete(user.username);
			}
			return reply.status(401).send({ error: "Invalid or expired 2FA session" });
		}

		if (user.provider == "local" && (!password || !await verifyPassword(user, password))) {
			key.tries--;
			return reply.status(401).send({ error: `Invalid password (${key.tries} tries left)` });
		}

		if (!/^\d{6}$/.test(code) || !authenticator.verifyToken(user.tfa!, code)) {
			key.tries--;
			return reply.status(400).send({ error: `Invalid 2FA code (${key.tries} tries left)` });
		}

		await remove2fa(server.db, user.username)
		return reply.status(201).send({ success: true });
	})
};
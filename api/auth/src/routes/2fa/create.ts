import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import authenticator from "authenticator";
import qrcode from "qrcode";
import {addTfa} from "../../db/add-tfa.js";
import {getUserByUsername} from "../../db/get-user-by-username.js";
import {decodeToken} from "../../utils/decode-token.js";
import {User} from "../../interface/user.js";
import argon2 from "argon2";
import {verifyPassword} from "../../utils/verify-password.js";
import {TokenPayload} from "../../interface/token-payload.js";
import google from "../callback/google.js";
import * as repl from "node:repl";

export const tempKeys = new Map<string, {token?:string, key?: string, relogin: boolean, eat?: number, tries?: number}>();
export const oauthRelogin = new Map<string, { username: string, eat: number }>

export default async function (server: FastifyInstance) {

	server.get('/api/auth/2fa/create', async function (request, reply) {

		//const user = await getUser(request, reply);

		const user = request.currentUser! as User;

		if (user.tfa) {
			return reply.status(401).send({ error: "2FA already enabled" });
		}

		if (user.provider == "local" || (user.provider != "local" && tempKeys.get(user.username)?.relogin === false)) {

			const formattedKey = authenticator.generateKey();
			tempKeys.set(user.username, {key: formattedKey, relogin: false, eat: Date.now() + (2 * 60 * 1000), tries: 5});

			const url = authenticator.generateTotpUri(formattedKey, user.username, "Transcendence", "SHA1", 6, 30);

			return reply.status(200).send({ url: await qrcode.toDataURL(url), provider: user.provider });
		}
		else {

			const token = crypto.randomUUID();

			tempKeys.set(user.username,	 {token: token, relogin: false});
			oauthRelogin.set(token, { username: user.username, eat: Date.now() + (2 * 60 * 1000) });

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

	server.post('/api/auth/2fa/create', async function (request, reply) {
		const { code, password } = request.body as { code: string; password?: string };
		const user = request.currentUser! as User;

		if (user.tfa) {
			return reply.status(401).send({ error: "2FA already enabled" });
		}

		const key = tempKeys.get(user.username);

		if (!key || !key.eat || !key.key || !key.tries || key.eat < Date.now()) {
			if (key) {
				tempKeys.delete(user.username);
			}
			return reply.status(401).send({ error: "Invalid or expired 2FA session" });
		}

		if (user.provider == "local" && (!password || !await verifyPassword(user, password))) {
			key.tries--;
			return reply.status(401).send({ error: `Invalid password (${key.tries} tries left)` });
		}

		console.log(code);
		console.log("Expected:", authenticator.generateToken(key.key))
		if (!/^\d{6}$/.test(code) || !authenticator.verifyToken(key.key!, code)) {
			key.tries--;
			return reply.status(400).send({ error: `Invalid 2FA code (${key.tries} tries left)` });
		}

		await addTfa(server.db, user.username, key.key!)
		return reply.status(201).send({ success: true });
	})
};
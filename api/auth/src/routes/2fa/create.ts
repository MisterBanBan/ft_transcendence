import {FastifyInstance, FastifyRequest} from "fastify";
import authenticator from "authenticator";
import qrcode from "qrcode";
import {add2fa} from "../../db/add-2fa.js";
import {User} from "../../interface/user.js";
import {verifyPassword} from "../../utils/verify-password.js";
import {createOAuthEntry} from "../../utils/handle-relog.js";
import {signToken} from "../../utils/sign-token.js";
import {TokenPayload} from "../../interface/token-payload.js";
import {setCookie} from "../../utils/set-cookie.js";
import {getUserByUsername} from "../../db/get-user-by-username.js";

export const create2FASessions = new Map<string, { token?:string, key?: string, relogin: boolean, eat?: number, tries?: number, timeout: NodeJS.Timeout }>();

export default async function (server: FastifyInstance) {

	server.get('/api/auth/2fa/create', async function (request: FastifyRequest, reply) {

		const user = request.currentUser;
		if (!user) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		if (user.tfa) {
			return reply.status(403).send({
				error: "Forbidden",
				message: "2FA is already enabled"
			});
		}

		const ttl = 2 * 60 * 1000;
		const eat = Date.now() + ttl;

		const timeout = setTimeout(() => {
			const session = create2FASessions.get(user.username);
			if (session) {
				create2FASessions.delete(user.username);
			}
		}, ttl);

		if (user.provider == "local" || (user.provider != "local" && create2FASessions.get(user.username)?.relogin === false)) {

			const formattedKey = authenticator.generateKey();

			if (create2FASessions.has(user.username))
				clearTimeout(create2FASessions.get(user.username)!.timeout)

			create2FASessions.set(user.username, { key: formattedKey, relogin: false, eat: eat, tries: 5, timeout: timeout });

			const url = authenticator.generateTotpUri(formattedKey, user.username, "Transcendence", "SHA1", 6, 30);

			return reply.status(200).send({
				url: await qrcode.toDataURL(url),
				provider: user.provider
			});
		}
		else {

			const token = crypto.randomUUID();

			if (create2FASessions.has(user.username))
				clearTimeout(create2FASessions.get(user.username)!.timeout)

			create2FASessions.set(user.username, { token: token, relogin: true, eat: eat, timeout: timeout });
			await createOAuthEntry(token, user.username, "create2FA", ttl, eat);

			if (user.provider == "google") {
				const redirectUri = encodeURIComponent(`https://redirectmeto.com/http://${process.env.HOSTNAME}:8080/api/auth/callback/google`);
				return reply.status(202).header('Location', "https://accounts.google.com/o/oauth2/v2/auth?" +
					"client_id=570055045570-c95opdokftohj6c4l7u9t7b46bpmnrkl.apps.googleusercontent.com&" +
					`redirect_uri=${redirectUri}&` +
					"response_type=code&scope=profile%20email&" +
					"access_type=offline&" +
					"include_granted_scopes=true&" +
					"prompt=login&" +
					"max_age=0&" +
					`state=relogin_${token}`).send({});
			} else if (user.provider == "42") {
				const redirectUri = encodeURIComponent(`https://redirectmeto.com/http://${process.env.HOSTNAME}:8080/api/auth/callback/42`);
				return reply.status(202).header('Location', "https://api.intra.42.fr/oauth/authorize?" +
					"client_id=u-s4t2ud-04dc53dfa151b3c595dfa8d2ad750d48dfda6fffd8848b0e4b1d438b00306b10&" +
					`redirect_uri=${redirectUri}&` +
					"response_type=code&" +
					`state=relogin_${token}`).send({});
			}
		}
	});

	server.post('/api/auth/2fa/create', async function (request: FastifyRequest, reply) {
		const { code, password } = request.body as { code: string; password?: string };

		const user = request.currentUser;
		if (!user) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		if (user.tfa) {
			return reply.status(403).send({
				error: "Forbidden",
				message: "2FA is already enabled"
			});
		}

		const key = create2FASessions.get(user.username);

		if (!key || !key.eat || !key.key || !key.tries || key.eat < Date.now()) {
			if (key) {
				create2FASessions.delete(user.username);
			}
			return reply.status(400).send({
				error: "Bad Request",
				message: "Invalid or expired 2FA session"
			});
		}

		const dbUser = await getUserByUsername(server.db, user.username);
		if (!dbUser) {
			return reply.code(500).send({
				error: "Internal Server Error",
				message: `An error occurred while getting user`,
			})
		}

		if (user.provider == "local" && (!password || !await verifyPassword(dbUser, password))) {
			key.tries--;
			return reply.status(400).send({
				error: "Bad Request",
				message: `Invalid password (${key.tries} tries left)`
			});
		}

		if (!/^\d{6}$/.test(code) || !authenticator.verifyToken(key.key!, code)) {
			key.tries--;
			return reply.status(400).send({
				error: "Bad Request",
				message: `Invalid 2FA code (${key.tries} tries left)`
			});
		}

		const timestamp = await add2fa(server.db, user.username, key.key!)

		const token: TokenPayload = {
			id: user.id,
			username: user.username,
			provider: user.provider,
			provider_id: user.provider_id,
			tfa: true,
			updatedAt: timestamp
		};

		await setCookie(reply, await signToken(server, token));
		return reply.status(201).send({ success: true });
	})
};
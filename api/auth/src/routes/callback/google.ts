import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../../db/get-user-by-username.js";
import {addUser} from "../../db/add-user.js";
import {TokenPayload} from "../../interface/token-payload.js";
import {createToken} from "../2fa/validate.js";
import {signToken} from "../../utils/sign-token.js";
import {setCookie} from "../../utils/set-cookie.js";
import {getUserByProviderId} from "../../db/get-user-by-provider-id.js";
import {oauthRelogin, tempKeys} from "../2fa/create.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/callback/google', async (request, reply) => {

		const { code, state } = request.query as { code?: string, state?: string };

		if (!code) {
			return reply.status(400).send({ error: "Missing code" });
		}

		if (state?.startsWith("relogin_")) {
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
			console.log("Relog done, redirecting");
			return reply.status(303).redirect("/2fa/create");
		}

		if (request.cookies?.token) {
			return reply.status(401).send({error: "Already logged"});
		}

		try {
			const access_token = await exchange(code);

			const data = await getUserProfile(access_token);
			const provider_id = data.sub as number;

			let user = await getUserByProviderId(server.db, provider_id);
			let payload: TokenPayload;

			if (user && user.provider == 'google' && user.provider_id == provider_id) {
				payload = {
					id: user.id!,
					username: user.username,
					provider: user.provider,
					provider_id: user.provider_id,
					updatedAt: user.updatedAt
				};
			}
			else {
				let timestamp = Date.now();

				const username = await generateUniqueUsername(server.db, data.given_name);

				user = { username: username, provider: "google", provider_id: data.sub, updatedAt: timestamp };

				const id = await addUser(server.db, user);
				payload = {
					id: id!,
					username: username,
					provider_id: data.sub,
					provider: "google",
					updatedAt: timestamp
				};
			}

			const token = await signToken(server, payload);

			if (!user.tfa) {
				await setCookie(reply, token);
				return reply.status(302).redirect('/');
			}
			else {
				return reply.status(302).redirect(`/2fa?token=${await createToken(user.username, token)}`);
			}
		} catch (error) {
			if (error instanceof Error)
				console.error(error.message);
		}
	});

	async function exchange(code: string): Promise<string> {
		const params = new URLSearchParams();
		params.append('code', code);
		params.append('client_id', process.env.CLIENT_ID_GOOGLE!);
		params.append('client_secret', process.env.CLIENT_SECRET_GOOGLE!);
		params.append('redirect_uri', 'https://localhost:8443/api/auth/callback/google');
		params.append('grant_type', 'authorization_code');

		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params
		});

		if (!response.ok) {
			console.error(response);
			throw new Error('Error while exchanging token.');
		}

		const data = await response.json();
		return data.access_token;
	}

	async function getUserProfile(access_token: string): Promise<any> {
		const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${access_token}` },
		});

		return response.json();
	}

	async function generateUniqueUsername(db: any, base: string): Promise<string> {
		const normalize = (str: string) =>
			str.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[^a-zA-Z0-9\-]/g, '');

		let cleanBase = normalize(base);

		if (cleanBase.length < 3) cleanBase = cleanBase.padEnd(3, "x");

		const maxBaseLength = 9;
		cleanBase = cleanBase.slice(0, maxBaseLength);

		let username = cleanBase;

		let tries = 0;
		do {
			const suffix = await generateRandomSuffix();
			username = cleanBase.slice(0, maxBaseLength) + "-" + suffix;
			tries++;
			if (tries > 20) throw new Error("Unable to generate unique username.");
		} while (await getUserByUsername(db, username));

		return username;
	}

	async function generateRandomSuffix(length: number = 6): Promise<string> {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * chars.length);
			result += chars[randomIndex];
		}
		return result;
	}
}
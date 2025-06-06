import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../../db/get-user-by-username.js";
import {addUser} from "../../db/add-user.js";
import {changeUsername} from "../../db/change-username.js";
import {TokenPayload} from "../../interface/token-payload.js";
import {createToken} from "../2fa/validate.js";
import {signToken} from "../../utils/sign-token.js";
import {setCookie} from "../../utils/set-cookie.js";
import {oauthRelogin, tempKeys} from "../2fa/create.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/callback/42', async (request, reply) => {
		const { code, state } = request.query as { code?: string; state?: string };

		if (!code) {
			return reply.status(400).send({
				error: "Missing code"
			});
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
			return reply.status(303).redirect("/2fa/create");
		}

		if (request.cookies?.token) {
			return reply.status(401).send({
				error: "Already logged"
			});
		}

		try {
			const access_token = await exchange(code);

			const data = await getUserProfile(access_token);
			const login = data.login as string;

			let user = await getUserByUsername(server.db, login);
			let payload: TokenPayload;
			let id;
			if (user && user.provider == '42') {
				payload = {
					id: user.id!,
					username: login,
					provider: user.provider,
					provider_id: user.provider_id,
					updatedAt: user.updatedAt
				};
			}
			else {
				let timestamp = Date.now();
				if (user && user.provider != '42') {
					const newUsername = user.username + '1';
					timestamp = await changeUsername(server.db, user.id!, newUsername);
				}

				user = {
					username: login,
					provider: "42",
					provider_id: data.id,
					updatedAt: timestamp
				};

				id = await addUser(server.db, user);
				payload = {
					id: id!,
					username: login,
					provider_id: data.id,
					provider: "42",
					updatedAt: timestamp
				};
			}

			const token = await signToken(server, payload);

			if (!user.tfa)
			{
				await setCookie(reply, token);
				return reply.status(302).redirect('/');
			}
			else
				return reply.status(302).redirect(`/2fa?token=${await createToken(login, token)}`);
		} catch (error) {
			if (error instanceof Error)
				console.error(error.message);
		}
	});

	async function exchange(code: string): Promise<string> {
		const params = new URLSearchParams();
		params.append('grant_type', 'authorization_code');
		params.append('client_id', process.env.CLIENT_ID_42!);
		params.append('client_secret', process.env.CLIENT_SECRET_42!);
		params.append('code', code);
		params.append('redirect_uri', `https://localhost:8443/api/auth/callback/42`);

		const response = await fetch('https://api.intra.42.fr/oauth/token', {
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
		const response = await fetch('https://api.intra.42.fr/v2/me', {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${access_token}` },
		});

		return response.json();
	}
}
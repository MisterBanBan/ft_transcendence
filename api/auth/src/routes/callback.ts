import {FastifyInstance} from "fastify";
import {getUserByUsername} from "../db/get-user-by-username.js";
import {addUser} from "../db/add-user.js";
import {getIdByUsername} from "../db/get-id-by-username.js";
import {changeUsername} from "../db/change-username.js";
import {TokenPayload} from "../interface/token-payload.js";
import {createToken} from "./2fa/validate.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/callback', async (request, reply) => {
		const { code } = request.query as { code?: string };
		if (!code) {
			return reply.status(400).send('Missing code');
		}

		try {
			const access_token = await exchange(code);

			const data = await getUserProfile(access_token);
			const login = data.login as string;

			let user = await getUserByUsername(server.db, login);
			let payload: TokenPayload;
			let id;
			if (user && user.provider == '42')
			{
				id = (await getIdByUsername(server.db, user.username))!;
				payload = { id: id, username: login, provider: "42", provider_id: user.provider_id, updatedAt: user.updatedAt };
			}
			else
			{
				let timestamp = Date.now();
				if (user && user.provider != '42')
				{
					const existingId = await getIdByUsername(server.db, user.username);
					const newUsername = user.username + '1';
					timestamp = await changeUsername(server.db, existingId!, newUsername);
				}

				user = { username: login, provider: "42", provider_id: data.id, updatedAt: timestamp };

				id = await addUser(server.db, user);
				payload = { id: id!, username: login, provider_id: data.id, provider: "42", updatedAt: timestamp}
			}

			const token = server.jwt.sign(payload, { noTimestamp: true });

			if (!user.tfa)
			{
				return reply.setCookie('token', token, {
					path: '/',
					httpOnly: true,
					secure: true,
					sameSite: true,
					maxAge: 3600
				}).status(302).redirect('/');
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
		params.append('redirect_uri', `https://${process.env.HOSTNAME}:8443/api/auth/callback`);

		const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params
		});

		if (!response.ok)
		{
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
import { FastifyInstance } from "fastify";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/callback', async (request, reply) => {
		console.log(request.query);
		const { code } = request.query as { code?: string };
		if (!code) {
			return reply.status(400).send('Missing code');
		}

		try {
			const access_token = await exchange(code);

			await getUserProfile(access_token);
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
		params.append('redirect_uri', 'https://localhost:8443/api/auth/callback');
		// TODO redirection

		const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params
		});

		if (!response.ok)
		{
			console.log(await response.json());
			console.log(params.toString());
			throw new Error('Error while exchanging token.');
		}

		const data = await response.json();
		return data.access_token;
	}

	async function getUserProfile(access_token: string) {
		const response = await fetch('https://api.intra.42.fr/v2/me', {
			method: 'GET',
			headers: { 'Authorization': `Bearer ${access_token}` },
		});

		const data = await response.json();
		console.log(data.login);
	}
}
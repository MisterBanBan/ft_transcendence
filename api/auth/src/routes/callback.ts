import {FastifyInstance, FastifyRequest} from "fastify";
import { getUserByUsername } from "../db/get-user-by-username.js";
import { addUser } from "../db/add-user.js";
import { getUserByProviderId } from "../db/get-user-by-provider-id.js";
import { signToken } from "../utils/sign-token.js";
import { setCookie } from "../utils/set-cookie.js";
import { createToken } from "./2fa/validate.js";
import {handleRelog, returnPopup} from "../utils/handle-relog.js";
import { validateUsername } from "../utils/validate-username.js";
import { TokenPayload } from "../interface/token-payload.js";

interface ProviderConfig {
	provider: "google" | "42"; 
	callbackPath: string;
	tokenUrl: string;
	profileUrl: string;
	clientId: string;
	clientSecret: string;
	getProviderId(profile: any): string;
	getDisplayName(profile: any): string;
}

const providers: ProviderConfig[] = [
	{
		provider: "google",
		callbackPath: "/api/auth/callback/google",
		tokenUrl: "https://oauth2.googleapis.com/token",
		profileUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
		clientId: process.env.CLIENT_ID_GOOGLE!,
		clientSecret: process.env.CLIENT_SECRET_GOOGLE!,
		getProviderId: (profile) => String(profile.sub),
		getDisplayName: (profile) => profile.given_name,
	},
	{
		provider: "42",
		callbackPath: "/api/auth/callback/42",
		tokenUrl: "https://api.intra.42.fr/oauth/token",
		profileUrl: "https://api.intra.42.fr/v2/me",
		clientId: process.env.CLIENT_ID_42!,
		clientSecret: process.env.CLIENT_SECRET_42!,
		getProviderId: (profile) => String(profile.id),
		getDisplayName: (profile) => profile.login,
	}
];

export default async function (server: FastifyInstance) {
	for (const config of providers) {
		server.get(config.callbackPath, async (request: FastifyRequest, reply) => {
			const { code, state } = request.query as { code?: string; state?: string };

			if (!code)
				return reply.status(302).redirect("/game#login");

			try {
				const token = await exchangeToken(config, code);
				const profile = await fetchUserProfile(config, token);
				const providerId = config.getProviderId(profile);
				const displayName = config.getDisplayName(profile);

				let user = await getUserByProviderId(server.db, providerId);

				if (state) {
					if (user)
						return await handleRelog(user, state, reply);
					else
						return returnPopup(reply, "Invalid account");
				}

				let payload: TokenPayload;
				let timestamp = Date.now();

				if (user && user.provider === config.provider && user.provider_id === providerId) {
					payload = {
						id: user.id!,
						username: user.username,
						provider: user.provider,
						provider_id: user.provider_id,
						tfa: Boolean(user.tfa),
						updatedAt: user.updatedAt,
					};
				} else {
					const username = await generateUniqueUsername(server.db, displayName);

					user = {
						username,
						provider: config.provider,
						provider_id: providerId,
						updatedAt: timestamp,
					};

					const id = await addUser(server.db, server.usersDb, user);

					payload = {
						id: id!,
						username,
						provider_id: providerId,
						provider: config.provider,
						tfa: Boolean(user.tfa),
						updatedAt: timestamp,
					};
				}

				const signedToken = await signToken(server, payload);

				if (!user.tfa) {
					await setCookie(reply, signedToken);
					return reply.status(302).redirect("/game");
				} else {
					return reply.status(302).redirect(`/game?token=${await createToken(user.username, signedToken)}#login`);
				}
			} catch (error) {
				if (error instanceof Error)
					console.error(error.message);
				return reply.status(302).redirect("/game#login");
			}
		});
	}
}

async function exchangeToken(config: ProviderConfig, code: string): Promise<string> {
	const params = new URLSearchParams();
	params.append('code', code);
	params.append('client_id', config.clientId);
	params.append('client_secret', config.clientSecret);
	params.append('redirect_uri', `https://redirectmeto.com/http://${process.env.HOSTNAME}:8080${config.callbackPath}`);
	params.append('grant_type', 'authorization_code');

	const response = await fetch(config.tokenUrl, {
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

async function fetchUserProfile(config: ProviderConfig, access_token: string): Promise<any> {
	const response = await fetch(config.profileUrl, {
		headers: { Authorization: `Bearer ${access_token}` }
	});

	return response.json();
}

async function generateUniqueUsername(db: any, base: string): Promise<string> {
	if (!await getUserByUsername(db, base) && await validateUsername(base))
		return base;

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
		username = cleanBase + "-" + suffix;
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
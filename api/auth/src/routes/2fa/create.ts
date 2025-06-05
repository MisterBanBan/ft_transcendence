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

const tempKeys = new Map<string, {key: string, eat: number}>();

export default async function (server: FastifyInstance) {

	async function getUser(request: FastifyRequest, reply: FastifyReply): Promise<User> {
		const token = request.cookies.token;

		const decodedToken = server.jwt.decode(token!) as TokenPayload;

		const user = await getUserByUsername(server.db, decodedToken.username);
		if (!user) {
			return reply.status(400).send("Couldn't find user");
		}

		if (user.tfa) {
			return reply.status(401).send("2FA already set up");
		}

		return user;
	}

	server.get('/api/auth/2fa/create', async function (request, reply) {

		const user = await getUser(request, reply);

		const formattedKey = authenticator.generateKey();

		console.log(formattedKey);

		tempKeys.set(user.username, {key: formattedKey, eat: Date.now() + (2 * 60 * 1000) });

		console.log(tempKeys.get(user.username));
		const url = authenticator.generateTotpUri(formattedKey, user.username, "transendence", "SHA1", 6, 30);

		console.log(url);

		return reply.status(200).send(await qrcode.toDataURL(url));
	});

	server.post('/api/auth/2fa/create', async function (request, reply) {
		const { code, password } = request.body as { code: string; password: string };

		const user = await getUser(request, reply);

		const key = tempKeys.get(user.username);

		if (!key || key.eat < Date.now()) {
			if (key) {
				tempKeys.delete(user.username);
			}
			return reply.status(401).send("Invalid or expired 2FA session");
		}

		if (user.provider == "local" && (!password || !await verifyPassword(user, password))) {
			return reply.status(401).send("Invalid password");
		}

		if (!/^\d{6}$/.test(code) || !authenticator.verifyToken(key.key, code))
			return reply.status(400).send("Invalid 2FA code");

		await addTfa(server.db, user.username, key.key)
		return reply.status(201).send("2FA method created");
	})
};
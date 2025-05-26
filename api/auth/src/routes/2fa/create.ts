import {FastifyInstance} from "fastify";
import authenticator from "authenticator";
import qrcode from "qrcode";
import {TokenPayload} from "../../interface/token-payload.js";
import {addTfa} from "../../db/add-tfa.js";
import {getUserByUsername} from "../../db/get-user-by-username.js";

const tempKeys = new Map<string, string>();

export default async function (server: FastifyInstance) {
	server.get('/api/auth/2fa/create', async function (request, reply) {
		console.log("GET /api/auth/2fa/create");

		if (!request.cookies || !request.cookies.token)
			return reply.status(400).send("Not logged in");

		const decodedToken = server.jwt.decode(request.cookies.token) as TokenPayload;
		const user = await getUserByUsername(server.db, decodedToken.username);
		if (!user)
			return reply.status(400).send("Couldn't find user");

		if (user.tfa)
			return reply.status(400).send("2FA already set up");

		const formattedKey = authenticator.generateKey();

		tempKeys.set(user.username, formattedKey);
		const url = authenticator.generateTotpUri(formattedKey, user.username, "localhost", "SHA1", 6, 30);

		reply.status(200).send(await qrcode.toDataURL(url));
	});

	server.post('/api/auth/2fa/create', async function (request, reply) {
		if (!request.cookies || !request.cookies.token)
			return reply.status(400).send("Not logged in");

		const decodedToken = server.jwt.decode(request.cookies.token) as TokenPayload;

		const user = await getUserByUsername(server.db, decodedToken.username);
		if (!user)
			return reply.status(400).send("Couldn't find user");

		if (user.tfa)
			return reply.status(400).send("2FA already set up")

		const body = request.body as string;
		if (!/^\d{6}$/.test(body)) {
			return reply.status(400).send("Invalid 2FA code");
		}

		const key = tempKeys.get(user.username);

		if (!key)
			return reply.status(400).send("The 2FA key doesn't exist");

		const isValid = authenticator.verifyToken(key, body)
		if (isValid)
		{
			await addTfa(server.db, user.username, key)
			return reply.status(200).send("2FA method created");
		}
		return reply.status(400).send("Invalid 2FA code");
	})
};
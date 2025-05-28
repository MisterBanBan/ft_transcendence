import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import authenticator from "authenticator";
import qrcode from "qrcode";
import {TokenPayload} from "../../interface/token-payload.js";
import {addTfa} from "../../db/add-tfa.js";
import {getUserByUsername} from "../../db/get-user-by-username.js";
import {decodeToken} from "../../utils/decode-token.js";
import {User} from "../../interface/user.js";

const tempKeys = new Map<string, string>();

export default async function (server: FastifyInstance) {

	async function getUser(request: FastifyRequest, reply: FastifyReply): Promise<User> {
		const token = request.cookies?.token;
		if (!token)
			return reply.status(400).send("Not logged in");

		const decodedToken = await decodeToken(server, token, reply);
		if (!decodedToken)
			return reply.status(401).send("Invalid token");

		const user = await getUserByUsername(server.db, decodedToken.username);
		if (!user)
			return reply.status(400).send("Couldn't find user");

		if (user.tfa)
			return reply.status(400).send("2FA already set up");

		return user;
	}

	server.get('/api/auth/2fa/create', async function (request, reply) {

		const user = await getUser(request, reply);

		const formattedKey = authenticator.generateKey();

		tempKeys.set(user.username, formattedKey);
		const url = authenticator.generateTotpUri(formattedKey, user.username, "localhost", "SHA1", 6, 30);

		reply.status(200).send(await qrcode.toDataURL(url));
	});

	server.post('/api/auth/2fa/create', async function (request, reply) {

		const user = await getUser(request, reply);

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
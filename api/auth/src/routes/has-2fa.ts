import {FastifyInstance} from "fastify";
import {User} from "../interface/user.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/has-2fa', async function (request, reply) {

		const user = request.currentUser! as User;

		if (user.tfa) {
			return reply.status(200).send({ has2FA: true });
		} else
			return reply.status(200).send({ has2FA: false });
	});
}
import {FastifyInstance, FastifyRequest} from "fastify";
import {User} from "../interface/user.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/has-2fa', async (request: FastifyRequest, reply) => {

		const user = request.currentUser;
		if (!user) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		if (user.tfa) {
			return reply.status(200).send({ has2FA: true });
		} else
			return reply.status(200).send({ has2FA: false });
	});
}
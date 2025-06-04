import {FastifyInstance} from "fastify";
import {TokenPayload} from "../interface/token-payload.js";

export default async function (server: FastifyInstance) {
	server.get('/api/auth/get-infos', async function (request, reply) {

		const token = request.cookies.token;

		try {
			const data = server.jwt.decode(token!) as TokenPayload;

			return reply.send(data);
		} catch {
			return reply.send(undefined);
		}
	});
}
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
	server.addHook('preHandler', async (request, reply) => {
		let encodedUser = request.headers['x-current-user'];

		if (Array.isArray(encodedUser)) {
			encodedUser = encodedUser[0];
		}

		if (encodedUser) {

			try {
				const decoded = JSON.parse(Buffer.from(encodedUser, 'base64').toString());

				if (!decoded || typeof decoded.id !== 'number'
					|| typeof decoded.username !== 'string'
					|| typeof decoded.provider !== 'string'
					|| ((typeof decoded.provider_id === 'object' && decoded.provider_id !== null) && typeof decoded.provider_id !== 'string')
					|| typeof decoded.tfa !== 'boolean'
					|| typeof decoded.updatedAt !== 'number')
					return reply.status(400).send({
						error: "Bad Request",
						message: "Invalid user data in header"
					});

				(request as any).currentUser = {
					id: decoded.id,
					username: decoded.username,
					avatar_url: decoded.avatar_url,
					provider: decoded.provider,
					provider_id: decoded.provider_id,
					tfa: decoded.tfa,
					updatedAt: decoded.updatedAt
				};
			} catch (error) {
				if (error instanceof Error) {
					return reply.status(400).send({
						error: "Bad Request",
						message: `Invalid x-current-user header (${error.message})`
					});
				} else {
					console.error(error);
					return reply.status(400).send({
						error: "Bad Request",
						message: `Invalid x-current-user header`
					});
				}
			}
		}
	});
}
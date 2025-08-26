import { FastifyInstance, FastifyRequest } from "fastify";

export default async function (server: FastifyInstance) {
	server.get<{
		Params: { username: string };
	}>('/api/users/:username/id', {
		schema: {
			params: {
				type: 'object',
				properties: {
					username: { type: 'string' }
				},
				required: ['username']
			},
			response: {
				200: {
					type: 'object',
					properties: {
						message: { type: 'string' },
						id: { type: 'number' },
					}
				},
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				},
				403: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				},
				401: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			}
		}
	}, async (request: FastifyRequest, reply) => {
		const { username } = request.params as { username: string };

		try {
			const id = (await server.db.get<{ id: number }>(
				`SELECT id FROM users WHERE username = ?`,
				[username]
			))?.id;

			if (!id) {
				return reply.status(404).send({
					error: 'User not found'
				});
			}

			return reply.send({
				message: 'User id correctly found',
				id: id
			});

		} catch (error) {
			server.log.error(error);
			return reply.status(500).send({
				error: 'Internal server error'
			});
		}
	});
}

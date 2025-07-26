import { FastifyInstance } from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/private', async (request, reply) => {
		
        const { client1, client2 } = request.body as {
			client1: string;
			client2: string;
		};

		server.privateQueue.set(client1, client2);
		server.privateQueue.set(client2, client1);
		reply.code(200).send({ status: 'ok' });
    });
}
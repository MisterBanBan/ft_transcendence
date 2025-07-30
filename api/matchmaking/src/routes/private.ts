import { FastifyInstance } from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/matchmaking/private', async (request, reply) => {
		
        const { client1, client2 } = request.body as {
			client1: string;
			client2: string;
		};

		server.privateQueue.set(client1, client2);
		server.privateQueue.set(client2, client1);
		
		// Attendre que client1 ou client2 soit dans privateResult (timeout 1000s)
        const waitForResult = (keys: string[], timeout = 1000000) => new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                for (const key of keys) {
                    if (server.privateResult.has(key)) {
                        return resolve({ key, value: server.privateResult.get(key) });
                    }
                }
                if (Date.now() - start > timeout) {
                    return reject(new Error("Timeout"));
                }
                setTimeout(check, 100);
            };
            check();
        });

        try {
            const result = await waitForResult([client1, client2]);
            reply.code(200).send({ status: 'ok', result });
        } catch (e) {
            reply.code(504).send({ status: 'timeout' });
        }
    });
}
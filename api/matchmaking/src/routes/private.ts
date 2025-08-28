import { FastifyInstance } from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/matchmaking/private', async (request, reply) => {
		
        const { client1, client2 } = request.body as {
			client1: string;
			client2: string;
		};

        if (!request.headers.origin || !client1 || !client2) {
            reply.code(400).send({ status: 'error', message: 'Invalid request' });
            return;
        }
        const type = request.headers.origin;

		if (request.protocol !== 'http') {
			reply.code(400).send({ status: 'error', message: 'Invalid protocol' });
            return;
		}

        console.log(`Private match request between ${client1} and ${client2}`);
		server.privateQueue.set(client1, {opponent: client2, type});
		server.privateQueue.set(client2, {opponent: client1, type});
		
        const waitForResult = (keys: string[], timeout = 10000) => new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                for (const key of keys) {
                    if (server.privateResult.has(key)) {
                        if (server.privateResult.get(key)?.type !== type) {
                            continue;
                        }
                        return resolve({ key, value: server.privateResult.get(key) });
                    }
                }
                if (Date.now() - start > timeout && (server.privateQueue.has(client1) || server.privateQueue.has(client2))) {
					return reject(new Error("Timeout"));
                }
                setTimeout(check, 1000);
            };
            check();
        });

        try {
            const result: any = await waitForResult([client1, client2]);
			server.privateResult.delete(result.key)
            reply.code(200).send({ status: 'ok', result});
            console.log("ok on private request : ", result)
        } catch (e) {
			let players: string[] = [];

			if (server.privateQueue.has(client1)) {
				players.push(client1)
			}

			if (server.privateQueue.has(client2)) {
				players.push(client2)
			}

			if (server.privateQueue.has(client1) && server.privateQueue.get(client1)!.type === type)
				server.privateQueue.delete(client1);
			if (server.privateQueue.has(client2) && server.privateQueue.get(client2)!.type === type)
				server.privateQueue.delete(client2);

            reply.code(504).send({ status: 'timeout', players});
            console.log("timeout on private request :", players);
        }
    });
}
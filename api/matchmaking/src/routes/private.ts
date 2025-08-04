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
		
		// Attendre que client1 ou client2 soit dans privateResult (timeout 10s)
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
            const result = await waitForResult([client1, client2]);
            reply.code(200).send({ status: 'ok', result });
        } catch (e) {
			let player: string[] | null = null;
			if (server.playerToGame.has(client1)) {
				if (player === null)
					player = [];
				player.push(client1);
			}
			if (server.playerToGame.has(client2)) {
				if (player === null)
					player = [];
				player.push(client2);
			}

            reply.code(504).send({ status: 'timeout', player });
        }
    });
}
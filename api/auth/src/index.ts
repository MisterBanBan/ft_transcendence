import fastify from 'fastify';
import {loadModules} from "./plugins.js";

export const server = fastify();

server.get('/health', async (request, reply) => {
	reply.code(200).send({ status: 'healthy' });
});

const start = async () => {
	try {
		await loadModules()

		await server.listen({ port: 8084, host: '0.0.0.0' });
		console.log('auth service is running on port 8080');
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();

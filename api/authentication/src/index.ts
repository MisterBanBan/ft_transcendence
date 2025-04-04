import fastify from 'fastify';

const server = fastify();

server.get('/health', async (request, reply) => {
    reply.code(200).send({ status: 'healthy' });
});

server.get('/api/authentication/', async (request, reply) => {
    reply.send({ authentication: ["authentication1", "authentication2", "authentication3"] });
});

const start = async () => {
    try {
        await server.listen({ port: 8084, host: '0.0.0.0' });
        console.log('authentication service is running on port 8080');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

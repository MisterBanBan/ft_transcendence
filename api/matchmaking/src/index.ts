import fastify from 'fastify';

const server = fastify();

server.get('/health', async (request, reply) => {
    reply.code(200).send({ status: 'healthy' });
});

server.get('/api/matchmaking/', async (request, reply) => {
    reply.send({ matchmaking: ["matchmaking1", "matchmaking2", "matchmaking3"] });
});

const start = async () => {
    try {
        await server.listen({ port: 8083, host: '0.0.0.0' });
        console.log('matchmaking service is running on port 8080');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

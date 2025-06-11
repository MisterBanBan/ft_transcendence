import fastify from 'fastify';

const server = fastify();

server.get('/health', async (request, reply) => {
    reply.code(200).send({ status: 'healthy' });
});

server.get('/api/game/', async (request, reply) => {
    reply.send({ game: ["game1", "game2", "game3"] });
});

const start = async () => {
    try {
        await server.listen({ port: 8082, host: '0.0.0.0' });
        console.log('game service is running on port 8080');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

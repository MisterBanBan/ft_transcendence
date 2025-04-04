import fastify from 'fastify';

const server = fastify();

server.get('/health', async (request, reply) => {
    reply.code(200).send({ status: 'healthy' });
});

server.get('/api/tournament/', async (request, reply) => {
    reply.send({ tournament: ["tournament1", "tournament2", "tournament3"] });
});

const start = async () => {
    try {
        await server.listen({ port: 8081, host: '0.0.0.0' });
        console.log('tournament service is running on port 8081');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

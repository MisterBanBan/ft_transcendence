import fastify from 'fastify';

const server = fastify();

server.get('/health', async (request, reply) => {
    reply.code(200).send({ status: 'healthy' });
});

server.get('/api/users/', async (request, reply) => {
    reply.send({ users: ["User1", "User2", "User3"] });
});

const start = async () => {
    try {
        await server.listen({ port: 8080, host: '0.0.0.0' });
        console.log('users service is running on port 8080');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();

import { fastify } from '../server.js';
import fastifyFormbody from '@fastify/formbody';

fastify.register(fastifyFormbody)

fastify.get('/auth', async function (request, reply) {  
    return reply.sendFile('auth.html');
});

fastify.post('/auth', async function (request, reply) {

    const { email, password } = request.body;
    console.log('Email:', email);
    console.log('Password:', password);

    return reply.sendFile('auth.html');
});
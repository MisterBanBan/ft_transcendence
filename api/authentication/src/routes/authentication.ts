import {FastifyInstance} from "fastify";
import { insertAuthentication } from '../db/insertAuthentication.js';

export default async function (server: FastifyInstance) {
    server.post('/api/authentication/', async function (request, reply) {
        const { username, email, password, token } = request.body as {
            username: string,
            email: string,
            password: string,
            token: string
        };
        try {
            const Id = await insertAuthentication(this.db, 'testname', 'testemail@gmail.com', 'pass1234', 'token1');
            reply.code(201).send({ id: Id, message: "authentication successfully created" });
        } catch (err: any) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                reply.code(409).send({ error: "username already exists" });
            } else {
                reply.code(500).send({ error: "Error during insertion" });
            }
        }
    });
    server.get('/api/authentication/', async function (request, reply) {
        try {
            const authentication = await this.db.all('SELECT * FROM authentication');
            reply.code(200).send({authentication});
            console.log({ authentication });
        } catch (err) {
            reply.code(500).send({error: "creation or restore failed."});
        }
    });
}
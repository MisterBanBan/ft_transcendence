import {FastifyInstance} from "fastify";
import { insertAuthentication } from '../db/insertAuthentication.js';

export default async function (server: FastifyInstance) {
    // server.post('/api/auth/', async function (request, reply) {
    //     const { username, email, password, token } = request.body as {
    //         username: string,
    //         email: string,
    //         password: string,
    //         token: string
    //     };
    //     try {
    //         const Id = await insertAuthentication(this.db, 'testname', 'testemail@gmail.com', 'pass1234', 'token1');
    //         reply.code(201).send({ id: Id, message: "auth successfully created" });
    //     } catch (err: any) {
    //         if (err.code === 'SQLITE_CONSTRAINT') {
    //             reply.code(409).send({ error: "username already exists" });
    //         } else {
    //             reply.code(500).send({ error: "Error during insertion" });
    //         }
    //     }
    // });
    // server.get('/api/auth/', async function (request, reply) {
    //     try {
    //         const auth = await this.db.all('SELECT * FROM auth');
    //         reply.code(200).send({auth});
    //         console.log({ auth });
    //     } catch (err) {
    //         reply.code(500).send({error: "creation or restore failed."});
    //     }
    // });
}
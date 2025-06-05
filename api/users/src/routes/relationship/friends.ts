import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/users/:userId/friends',
        async (request, reply) => {
            try {

            }
        }
    );
}
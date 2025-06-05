import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/users/:requesterId/accept',
        async (request, reply) => {
            try {

            }
        }
    );
}
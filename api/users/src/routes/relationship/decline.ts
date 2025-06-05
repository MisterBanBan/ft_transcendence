import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
    server.post('/api/users/:requesterId/decline',
        async (request, reply) => {
            try {

            }
        }
    );
}
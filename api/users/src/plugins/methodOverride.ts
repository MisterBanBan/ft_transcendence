import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
    fastify.addHook('preHandler', async (request, reply) => {
        const override = request.headers['x-http-method-override'];

        if (override && request.method === 'POST') {
            const methodOverride = Array.isArray(override) ? override[0] : override;

            const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
            const upperMethod = methodOverride.toUpperCase();

            if (validMethods.includes(upperMethod)) {
                (request as any).method = upperMethod;
            }
        }
    });
}

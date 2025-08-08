/* import { FastifyInstance, FastifyPluginAsync } from "fastify";

const cleanupPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    let cleanupInterval: NodeJS.Timeout;

    const performCleanup = async () => {
        try {
            const result = await fastify.db.run(
                `UPDATE users SET status = 'offline' 
                 WHERE status != 'offline' 
                 AND datetime(last_activity) < datetime('now', '-5 minutes')`
            );

            if (result.changes && result.changes > 0) {
                fastify.log.info(`Marked ${result.changes} inactive users as offline`);
            }
        } catch (error) {
            //fastify.log.error('Error cleaning inactive users:', error);
            console.log(error);
        }
    };

    fastify.addHook('onReady', async () => {
        fastify.log.info('Starting user cleanup service...');

        cleanupInterval = setInterval(performCleanup, 60000);

        await performCleanup();
    });

    fastify.addHook('onClose', async () => {
        if (cleanupInterval) {
            clearInterval(cleanupInterval);
            fastify.log.info('Cleanup interval cleared');
        }
    });
};

export default cleanupPlugin;
 */
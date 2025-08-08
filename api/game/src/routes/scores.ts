import { FastifyInstance } from 'fastify';
import { getAllGameScores, getPlayerScore } from '../db/getScore.js';

export default async function (fastify: FastifyInstance) { 
    fastify.get('/api/game/getScore', async (request, reply) => {
        const db = fastify.db;
        console.log('Fetching all game scores');
        try {
            const scores = await getAllGameScores(db, 20);
            console.log(scores);
            return reply.code(200).send({ success: true, data: scores });
        }
        catch (error) {
            console.error(error);
            return reply.code(401).send({ success: false, error: 'Database error' });
        }
    });
    fastify.get('/api/game/getScore/player/:userId', async (request, reply) => {
        const { userId } = request.params as { userId: string };
        const db = fastify.db;
        console.log(`Fetching scores for user ID: ${userId}`);
        try {
            const scores = await getPlayerScore(db, userId, 10);
            console.log(scores);
            return reply.code(200).send({ success: true, data: scores });
        } catch (error) {
            console.error(error);
            return reply.code(401).send({ success: false, error: 'Database error' });
        }
    });
}
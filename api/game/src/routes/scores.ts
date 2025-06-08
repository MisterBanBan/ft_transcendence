/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   scores.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/08 11:18:41 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/08 11:44:37 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyInstance } from 'fastify';
import { getAllGameScores, getPlayerScore } from '../db/getScore.js';

export default async function (fastify: FastifyInstance) { 
    fastify.get('/api/game', async (request, reply) => {
        const db = fastify.db;
        try {const scores = await getAllGameScores(db, 20);
            return { success: true, data: scores };
        }
        catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({ success: false, error: 'Database error' });
        }
    });
    fastify.get('/api/game/player/:userId', async (request, reply) => {
        const { userId } = request.params as { userId: string };
        const db = fastify.db;
        
        try {
            const scores = await getPlayerScore(db, parseInt(userId), 10);
            return { success: true, data: scores };
        } catch (error) {
            fastify.log.error(error);
            return reply.code(500).send({ success: false, error: 'Database error' });
        }
    });
}
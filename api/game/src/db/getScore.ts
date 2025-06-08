/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getScore.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/07 17:51:07 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/08 16:07:48 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { FastifyInstance } from "fastify";
import type {Database} from 'sqlite';

interface Score {
    winnerScore: number;
    looserScore: number;
    winnerNickname: string;
    looserNickname: string;
}
//async to wait bd
//promise<Score[]> to return a list of scores
//db.all<Score[]> to execute request to database and convert result to score
export async function getAllGameScores(db: Database, limit: number = 20) : Promise<Score[]> {
    return await db.all<Score[]>(
        `SELECT winner_score as winnerScore, loser_score as looserScore, 
                winner as winnerNickname, loser as looserNickname, created_at as createdAt
         FROM history
         ORDER BY created_at DESC
         LIMIT ?`,
        [limit]
    );
}

export async function getPlayerScore(db: Database, winnerId: number, looserId: number, limit: number = 10) :Promise<Score[]> {
    return await db.all<Score[]>(
        `SELECT winner_score as winnerScore, loser_score as looserScore, 
                winner as winnerNickname, loser as looserNickname, created_at as createdAt
         FROM history
         WHERE winner = (SELECT nickname FROM users WHERE id = ?)
         OR looser = (SELECT nickname FROM users WHERE id = ?)
         ORDER BY created_at DESC
         LIMIT ?`,
         [winnerId, looserId, limit]
    );
}
/*
export async function getBestScore(db: Database, limit: number = 10) : Promise<Score[]> {
    return await db.all<Score[]>(
        `SELECT winner_score as winnerScore, loser_score as looserScore, 
                winner as winnerNickname, loser as looserNickname, created_at as createdAt
                `
    )
}*/
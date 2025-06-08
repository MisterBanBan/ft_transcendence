/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   score.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/06 18:31:06 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/08 16:25:49 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { getGlobalScore, getPlayerScore } from "./scoreService.js";

interface Score {
    winnerScore: number;
    looserScore: number;
    winnerNickname: string;
    looserNickname: string;
}

export const score = async (): Promise<string> => {
    try { 
        const globalScores = await getGlobalScore();
        const currentUserId = 1;
        const userScores = await getPlayerScore(currentUserId);
    return `
    <div id="scoreContainer" class="flex flex-col h-full w-full items-center justify-center  bg-black/60">
        <div class="flex h-full w-full justify-center items-center gap-12">
        <div id="GlobalRanking" class="flex flex-col gap-2 w-[35%] h-[35%] items-center justify-start">
            <h2 class="responsive-text-score text-white">Global Ranking</h2>
            <div class="flex justify-between w-full text-center responsive-text-ranking">
                <span>Rank</span>
                <span>Nickname</span>
                <span>Score</span>
            </div>
            ${globalScores.map((score: Score, index: number) => `
                <div class="flex justify-between w-full text-center responsive-text-ranking">
                    <span>${index + 1}</span>
                    <span>${score.winnerNickname}</span>
                    <span>${score.winnerScore}</span>
                </div>
            `).join('')}
        </div >
        <div id="userScore" class="w-[35%] h-[35%] flex flex-col items-center justify-start gap-2">
            <h2 class="responsive-text-score text-white">My last game</h2>
            <div class="flex justify-between text-center w-full responsive-text-ranking">
                <span>Rank</span>
                <span>Nickname</span>
                <span>Score</span>
            </div>
            ${userScores.length > 0 ? userScores.map((score: Score, index: number) => `
                <div class="flex justify-between w-full text-center responsive-text-ranking">
                    <span>${index + 1}</span>
                    <span>${score.winnerNickname}</span>
                    <span>${score.winnerScore}</span>
                </div>
            `).join('') : `<div class="text-white">No games played</div>`}
        </div>
        </div>
        <button type="button" id="profileReturnBtn" class="text-white bottom-[20%] responsive-text ">Return</button>

    
    </div>
`;
} catch (error) {
    console.error('Error scores:', error);
        return `<div class="text-white text-center">Load score failes</div>`;
}};
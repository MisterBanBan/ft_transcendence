/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   scoreService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/08 14:19:04 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/08 15:39:25 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function getGlobalScore() {
    try {
        const response = await fetch('/api/game');
        const data = await response.json();
        if(!data.success) {
            throw new Error('Failed to fetch scores');
        }
        return data.data;
    }
    catch (error) {
        console.error('Error fetching global scores:', error);
        return [];
    }
}

export async function getPlayerScore(userId: number) {
    try {
        const response = await fetch(`/api/game/player/${userId}`);
        const data = await response.json();
        if(!data.success) {
            throw new Error('Failed to fetch player scores');
        }
        return data.data;
    } catch (error) {
        console.error(`Error fetching scores for user ${userId}:`, error);
        return [];
    }
}
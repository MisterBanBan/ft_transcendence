/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   scoreService.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/08 14:19:04 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/08 18:53:49 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function getGlobalScore() {
    try {
        const response = await fetch(`/api/game/getScore`, {
            method: "GET", 
          });
          console.log("Status HTTP:", response.status);
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

export async function getPlayerScore(userId: string) {
    try {
        const response = await fetch(`/api/game/getScore/player/${userId}`, {
            method: "GET", 
          });
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
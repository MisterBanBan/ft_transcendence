/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 17:18:21 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/10 16:07:44 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const friends = () => {

    const sortedFriends = friend.filter(f => typeof f.trophee === 'number').sort((a,b) => b.trophee - a.trophee);
    let nb = 0;
    return `
        <div class="h-full w-full overflow-y-auto ">
            ${sortedFriends.map(f => `
            <div class="flex flex-row justify-between items-center gap-4 responsive-text-historique ">
                <p class="w-10 h-10">${0+nb++}</p>
                <img src="${f.img}" alt="${f.name}" class="w-10 h-10 rounded-full object-contain"/>
                <button id="friend" class="responsive-text-historique">${f.name}</button>
                <span >${f.lastConnexion}</span>
                <span class="text-yellow-400 ml-2">🏆 ${f.trophee}</span>
            </div>
                `).join('')}
        </div>
`;
};

const friend = [
    { player1: 1, img: "/img/last_airbender.jpg", name: "Jean", lastConnexion: 1, trophee: 1200 },
    { player1: 2, img: "/img/last_airbender.jpg", name: "Alice", lastConnexion: 2, trophee: 950 },
    { player1: 3, img: "/img/last_airbender.jpg", name: "Bob", lastConnexion: 5, trophee: 800 },
    { player1: 4, img: "/img/last_airbender.jpg", name: "Sarah", lastConnexion: 3, trophee: 1500 },
    { player1: 5, img: "/img/last_airbender.jpg", name: "Léo", lastConnexion: 7, trophee: 400 },
    { player1: 6, img: "/img/last_airbender.jpg", name: "Emma", lastConnexion: 1, trophee: 1750 },
    { player1: 7, img: "/img/last_airbender.jpg", name: "Paul", lastConnexion: 4, trophee: 1100 },
    { player1: 8, img: "/img/last_airbender.jpg", name: "Julia", lastConnexion: 2, trophee: 600 },
    { player1: 9, img: "/img/last_airbender.jpg", name: "Antoine", lastConnexion: 6, trophee: 900 },
    { player1: 10, img: "/img/last_airbender.jpg", name: "Laura", lastConnexion: 3, trophee: 1300 },
    { player1: 11, img: "/img/last_airbender.jpg", name: "Kevin", lastConnexion: 8, trophee: 300 },
    { player1: 12, img: "/img/last_airbender.jpg", name: "Léa", lastConnexion: 2, trophee: 1600 },
    { player1: 13, img: "/img/last_airbender.jpg", name: "Axel", lastConnexion: 5, trophee: 700 },
    { player1: 14, img: "/img/last_airbender.jpg", name: "Chloé", lastConnexion: 1, trophee: 1400 },
    { player1: 15, img: "/img/last_airbender.jpg", name: "Quentin", lastConnexion: 4, trophee: 1000 },
    { player1: 16, img: "/img/last_airbender.jpg", name: "Inès", lastConnexion: 3, trophee: 850 },
    { player1: 17, img: "/img/last_airbender.jpg", name: "Adam", lastConnexion: 6, trophee: 2000 },
    { player1: 18, img: "/img/last_airbender.jpg", name: "Zoé", lastConnexion: 2, trophee: 950 },
    { player1: 19, img: "/img/last_airbender.jpg", name: "Maël", lastConnexion: 7, trophee: 500 },
    { player1: 20, img: "/img/last_airbender.jpg", name: "Lucie", lastConnexion: 1, trophee: 1800 },
  ];
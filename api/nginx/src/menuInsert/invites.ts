/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   invites.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 17:18:30 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/11 20:46:34 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const invites = () => `


    <div class="h-full w-full overflow-y-auto flex-col items-center justify-center">
                        ${invite.slice(0, 30).map(player => `
                        <div class="flex flex-row items-center justify-between responsive-text-historique ">
                            <div class="flex flex-row items-center gap-4">
                                <img src="${player.img}" alt="${player.pseudo}" class="w-10 h-10 rounded-full object-contain"/>
                                <span class=" text-white">${player.pseudo}</span>
                            </div>
                            <span class="right-0">${player.trophee}</span>
                        </div>
                        <div class="flex flex-row justify-center gap-8 responsive-text-historique ">
                            <button id="reject" class="responsive-text-historique text-red-600">REJECT</button>
                            <button id="accept" class="responsive-text-historique text-green-600">ACCEPT</button>
                        </div>
                        `).join('')}
                    </div>
`


const invite = [
    { pseudo: "Jean", img: "/img/last_airbender.jpg", trophee: 1200 },
    { pseudo: "Alice", img: "/img/last_airbender.jpg", trophee: 950 },
    { pseudo: "Bob", img: "/img/last_airbender.jpg", trophee: 800 },
    { pseudo: "Sarah", img: "/img/last_airbender.jpg", trophee: 1500 },
    { pseudo: "Léo", img: "/img/last_airbender.jpg", trophee: 400 },
    { pseudo: "Emma", img: "/img/last_airbender.jpg", trophee: 1750 },
    { pseudo: "Paul", img: "/img/last_airbender.jpg", trophee: 1100 },
    { pseudo: "Julia", img: "/img/last_airbender.jpg", trophee: 600 },
    { pseudo: "Antoine", img: "/img/last_airbender.jpg", trophee: 900 },
    { pseudo: "Laura", img: "/img/last_airbender.jpg", trophee: 1300 },
    { pseudo: "Kevin", img: "/img/last_airbender.jpg", trophee: 300 },
    { pseudo: "Léa", img: "/img/last_airbender.jpg", trophee: 1600 },
    { pseudo: "Axel", img: "/img/last_airbender.jpg", trophee: 700 },
    { pseudo: "Chloé", img: "/img/last_airbender.jpg", trophee: 1400 },
    { pseudo: "Quentin", img: "/img/last_airbender.jpg", trophee: 1000 },
    { pseudo: "Inès", img: "/img/last_airbender.jpg", trophee: 850 },
    { pseudo: "Adam", img: "/img/last_airbender.jpg", trophee: 2000 },
    { pseudo: "Zoé", img: "/img/last_airbender.jpg", trophee: 950 },
    { pseudo: "Maël", img: "/img/last_airbender.jpg", trophee: 500 },
    { pseudo: "Lucie", img: "/img/last_airbender.jpg", trophee: 1800 },
  ];
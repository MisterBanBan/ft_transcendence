/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendsActif.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/23 21:25:26 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/24 11:20:02 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export const friendsActif = () => {

    const verts = friend.filter(f => f.pastille === "vert");
    const rouges = friend.filter(f => f.pastille === "rouge");
    const grises = friend.filter(f => f.pastille === "grise");
    const sortedFriends = [...verts, ...rouges, ...grises];
    
    return `
        <div class="h-full w-full overflow-y-auto ">
            ${sortedFriends.map((f, i) => `
            <div class="flex flex-row justify-between items-center gap-2 responsive-text-historique ">
                <img src="${f.img}" alt="${f.name}" class="w-10 h-10 rounded-full object-contain"/>
                <button id="friend" class="responsive-text-historique">${f.name}</button>
                <span class=" w-3 h-3 rounded-full border-2 border-white ${
                    f.pastille === "vert" ? "bg-green-500" : f.pastille === "rouge" ? "bg-red-500" : "bg-gray-400"
                  }"></span>
            </div>
                `).join('')}
        </div>
`;
};

const friend = [
    { img: "/img/last_airbender.jpg", name: "Amine", pastille: "vert" },
    { img: "/img/last_airbender.jpg", name: "Clara", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Tony", pastille: "rouge" },
    { img: "/img/last_airbender.jpg", name: "Léna", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Boris", pastille: "rouge" },
    { img: "/img/last_airbender.jpg", name: "Elsa", pastille: "vert" },
    { img: "/img/last_airbender.jpg", name: "Maxime", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Sofia", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Remi", pastille: "rouge" },
    { img: "/img/last_airbender.jpg", name: "Hugo", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Sam", pastille: "rouge" },
    { img: "/img/last_airbender.jpg", name: "Lola", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Yann", pastille: "rouge" },
    { img: "/img/last_airbender.jpg", name: "Jade", pastille: "vert" },
    { img: "/img/last_airbender.jpg", name: "Victor", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Anaïs", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Théo", pastille: "rouge" },
    { img: "/img/last_airbender.jpg", name: "Nora", pastille: "grise" },
    { img: "/img/last_airbender.jpg", name: "Diane", pastille: "rouge" },
    { img: "/img/last_airbender.jpg", name: "Malik", pastille: "vert" },
];

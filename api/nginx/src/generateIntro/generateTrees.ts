/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   generateTrees.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/08 13:47:42 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/02 14:01:28 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export function generateTrees(containerId:string, count: number = 15): HTMLElement[] {
    const container = document.getElementById(containerId);
    if(!container) {
        throw new Error(`Container #${containerId} not found`);
    }

    const treesS: HTMLElement[] = [];
    const step = 100 / count;
    for(let i = 0; i < count; i++)
    {
        const tree = document.createElement('img');
        if(i < 5)
            tree.src = '/img/tree2.png';
        else if(i < 10)
            tree.src = '/img/tree3.png';
        else
            tree.src = '/img/tree1.png';
        tree.alt = 'tree';
        tree.style.position = 'absolute';
        const minVw = 10;
        const maxVw = 25;
        const size = randomSize(minVw, maxVw);
        tree.style.width = `${size}vw`;
        tree.style.height = 'auto';
        tree.style.bottom = `${13}%`;
        tree.style.left = `${i * step + Math.random() * (step * 0.5)}%`;
        container.appendChild(tree);
        treesS.push(tree);
    }
    return treesS;

    function randomSize(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}

export function destroyTree(treesS: HTMLElement[]): void {
    treesS.forEach(treesS => treesS.remove());
}
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   intro.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/04/28 10:52:39 by afavier           #+#    #+#             */
/*   Updated: 2025/07/16 17:12:38 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import PlayerController from "./scripts.js";
import { Component } from "./component.js";
import { Zoom } from './zoom.js'

function initZoom() {
    if (window.location.pathname === "/Tv") {
        const zoomElement = document.getElementById("zoom");
        if (zoomElement) {
            new Zoom('zoom');
        }
    }
}

interface IPlayerController {
    destroy(): void;
}



export class introduction implements Component{
    private activePlayerController: IPlayerController | null = null;


    constructor(playerId: string) {}

    public init(): void {
        const playerElement = document.getElementById("player");
        const pressEElement = document.getElementById("pressE");
        if (playerElement && pressEElement) {
            this.loadPlayerScripts();
        }
        else {
            setTimeout(() => this.init(), 50);
        }
    }

    public destroy(): void {
        this.activePlayerController?.destroy();
        this.activePlayerController = null;
    }
    
    private async loadPlayerScripts() {
        try {
            this.activePlayerController = new PlayerController('player', 'pressE');
        } catch (error) {
            console.error("Erreur lors du chargement des scripts:", error);
        }
    }
}


window.addEventListener('popstate', initZoom);
document.addEventListener('DOMContentLoaded', initZoom);


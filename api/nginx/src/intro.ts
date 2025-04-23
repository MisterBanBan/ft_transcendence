import { PlayerAnimation } from "./player_animation.js";
import PlayerController from "./scripts.js";
import { Zoom } from './zoom.js'
import { menu } from './menu.js'

function initZoom() {
    if (window.location.pathname === "/Tv") {
        const zoomElement = document.getElementById("zoom");
        if (zoomElement) {
            new Zoom('zoom');
        }
    }
}

/*Permet d'eviter que le player tourne en fond sur d'autres page*/
interface IPlayerController {
    destroy(): void;
}



export class introduction {
    private activePlayerController: IPlayerController | null = null;
    //private appDiv: HTMLElement;

    constructor(playerId: string){
        const player = document.getElementById(playerId);
        if (window.location.pathname === "/") {
            this.checkForElements();
        }
        if (window.location.pathname === "/game") {
            new menu("menu");
        }
    }
    //this.appDiv.innerHTML = content;

    // Charger dynamiquement le script à chaque fois qu'on revient sur l'accueil

    //this.appDiv.innerHTML = content;
    private checkForElements() {
        const playerElement = document.getElementById("player");
        const pressEElement = document.getElementById("pressE");
        if (playerElement && pressEElement) {
            this.loadPlayerScripts();
        }
        else {
            setTimeout(() => this.checkForElements(), 50);
        }
    }
    //initZoom();
    private async loadPlayerScripts() {
        try {
            this.activePlayerController = new PlayerController('player', 'pressE');
        } catch (error) {
            console.error("Erreur lors du chargement des scripts:", error);
        }
    }
    /*if (this.activePlayerController) {
        this.activePlayerController.destroy();
        this.activePlayerController = null;
    }*/
}

    
    

    
    


window.addEventListener('popstate', initZoom);
document.addEventListener('DOMContentLoaded', initZoom);


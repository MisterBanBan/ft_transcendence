import PlayerController from "./scripts.js";
import { Component } from "../route/component.js";

interface IPlayerController {
    destroy(): void;
}



export class introduction implements Component{
    private activePlayerController: IPlayerController | null = null;
    private playerId: string;

    constructor(playerId: string) {
        this.playerId = playerId;
    }

    public init(): void {
        const playerElement = document.getElementById(this.playerId);
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
            this.activePlayerController = new PlayerController(this.playerId, 'pressE');
        } catch (error) {
            console.error("Error to load scripts:", error);
        }
    }
}
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentView.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 16:24:16 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/30 11:13:53 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "../component.js";
import { viewManager } from "./viewManager.js";
import { tournament } from "../menuInsert/tournament.js";
import { tournamentList } from "../menuInsert/listingTournament.js";
import { tournamentPage8 } from "../menuInsert/tournamentPage8.js";
import { createTournament } from "../menuInsert/createTournament.js";
import { joinTournament } from "../menuInsert/joinTournament.js"

export class tournamentView implements Component{
    
    private container: HTMLElement;
    private viewManager: viewManager;

    constructor(container: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = tournament();
        this.listTournament();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        //document.getElementById('score')?.addEventListener('click', this.handleScore);
    }

    private listTournament() {
        const listtournament = document.getElementById('dynamic-tournament');
        if (!listtournament) {
            console.error('Tournament container not found');
            return;
        }
        const creatTournament = document.getElementById('creatTournament');
        if (!creatTournament) {
            console.error('Tournament page container not found');
            return;
        }
        const tournamentButton = document.getElementById('tournamentButton');

        creatTournament.innerHTML = '';
        creatTournament.insertAdjacentHTML('beforeend', createTournament());
        listtournament.innerHTML = '';
        listtournament.insertAdjacentHTML('beforeend', tournamentList());
        if (!tournamentButton) {
            console.error('Tournament page container not found');
            return;
        }
        tournamentButton.addEventListener('click', () => {
            this.viewManager.show('game');
        });
        document.querySelectorAll('.tournament-btn').forEach(item => {
            console.log('Button clicked:', item);
            item.addEventListener('click', () =>  this.tournamentPage());
        });
    }

    private tournamentPage() {
        
        const tournamentPageContainer = document.getElementById('dynamic-tournament');
        if (!tournamentPageContainer) {
            console.error('Tournament page container not found');
            return;
        }
        const creatTournament = document.getElementById('creatTournament');
        if (!creatTournament) {
            console.error('Tournament page container not found');
            return;
        }

        tournamentPageContainer.innerHTML = '';
tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage8());
const tournamentButton = document.getElementById('tournamentButton');
tournamentButton?.addEventListener('click', () => this.listTournament());

        creatTournament.innerHTML = '';
        creatTournament.insertAdjacentHTML('beforeend', joinTournament());
    }

    public destroy(): void {
        this.container.innerHTML = '';
    }
}
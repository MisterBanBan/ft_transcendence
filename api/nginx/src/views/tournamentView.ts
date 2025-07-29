/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentView.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 16:24:16 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/28 18:57:39 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "../component.js";
import { viewManager } from "./viewManager.js";
import { tournament } from "../menuInsert/tournament.js";
import { tournamentList } from "../menuInsert/listingTournament.js";
import { tournamentPage } from "../menuInsert/tournamentPage.js";

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
        listtournament.innerHTML = '';
        listtournament.insertAdjacentHTML('beforeend', tournamentList());
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
        tournamentPageContainer.innerHTML = '';
        tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage());
    }

    public destroy(): void {
        this.container.innerHTML = '';
    }
}
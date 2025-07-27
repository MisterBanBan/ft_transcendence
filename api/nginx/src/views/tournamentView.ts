/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentView.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 16:24:16 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/27 12:02:59 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "../component.js";
import { viewManager } from "./viewManager.js";
import { tournament } from "../menuInsert/tournament.js";

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
        this.attachEventListeners();
    }

    private attachEventListeners() {
        //document.getElementById('score')?.addEventListener('click', this.handleScore);
    }

    public destroy(): void {
        this.container.innerHTML = '';
    }
}
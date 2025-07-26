/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentView.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 16:24:16 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/25 16:59:24 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "../component.js";
import { viewManager } from "./viewManager.js";

export class tournamentView implements Component{
    
    private container: HTMLElement;
    private viewManager: viewManager;

    constructor(container: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = `<div class="tournament-view">
            <h1>Tournament View</h1>
            <p>Here you can view and manage tournaments.</p>
        </div>`;
    }

    public destroy(): void {
        this.container.innerHTML = '';
    }
}
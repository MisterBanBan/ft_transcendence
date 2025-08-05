/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   registerView.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/19 14:23:46 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/27 11:02:48 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { viewManager } from "./viewManager.js";
import { registerForm } from "../menuInsert/Connection/registerForm.js";
import { getUser } from "../user-handler.js";
import { wait } from "../wait.js";
import { Register } from "../auth/register.js";
import { Component } from "../component.js";
import {router} from "../router.js";

export class registerView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    
    private handleSubmit = () => this.submit_registerForm();
    private handleLogin = () =>  router.navigateTo("/game#login");

    constructor(container: HTMLElement, private formspicture: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = registerForm();
        const registerLogic = new Register();
        registerLogic.init();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('submit-register')?.addEventListener('click', this.handleSubmit);
        document.getElementById('loginBtn')?.addEventListener('click', this.handleLogin);
    }
    
    public async submit_registerForm() {

        const limit = 10;
        let attempts = 0;
        while (!getUser() && attempts < limit) {
            await wait(1000);
            attempts++;
        }
        if (getUser()) {
            router.navigateTo("/game")
            // this.viewManager.show('game');
        }
        this.attachEventListeners(); 
    }

    public destroy(): void {
        document.getElementById('submit-register')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('loginBtn')?.removeEventListener('click', this.handleLogin);
    }
}
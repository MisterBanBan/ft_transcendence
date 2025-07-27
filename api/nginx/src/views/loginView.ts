/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loginView.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/19 13:56:40 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/27 11:03:02 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { viewManager } from "./viewManager.js";
import { getUser } from "../user-handler.js";
import { wait } from "../wait.js";
import { twoFApopUp } from "../menuInsert/Connexion/twoFApopUp.js";
import {TFAValidate} from "../auth/2fa-validate.js";
import { Login } from "../auth/login.js";
import { loginForm } from "../menuInsert/Connexion/loginForm.js";
import { Component } from "../component.js";


export class loginView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private handleSubmit = () => this.submit_loginForm();
    private handleRegister = () => this.viewManager.show('register');

    constructor(container: HTMLElement,  viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = loginForm();
        const loginLogic = new Login();
        loginLogic.init();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('submit-login')?.addEventListener('click', this.handleSubmit);
        document.getElementById('registerBtn')?.addEventListener('click', this.handleRegister);

    }
    //bloquer lenvoie de pleins de submit
    public async submit_loginForm() {

        const submitBtn = document.getElementById('submit-login') as HTMLButtonElement;
        if (submitBtn) submitBtn.disabled = true;
        
        const limit = 10;
        let attempts = 0;
        while (!getUser() && attempts < limit) {
            await wait(1000);
            attempts++;
        }

        const user = getUser();
        if (user) {
            if (user.tfa) {
                //a changer
                this.container.insertAdjacentHTML('beforeend', twoFApopUp());
                const tfaValidate = new TFAValidate(user.username);
                tfaValidate.init();
            }
            else {
                this.viewManager.show('game');
            }
        } else if (attempts >= limit) {
            console.error("Login request timed out.");
        }
         
    }


    public destroy(): void {
        document.getElementById('submit-login')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('registerBtn')?.removeEventListener('click', this.handleRegister);
    }

    
}
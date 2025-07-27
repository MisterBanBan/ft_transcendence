/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   settingsView.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/16 20:22:54 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/26 12:01:20 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { settings } from "../menuInsert/settings.js";
import { newPseudo } from "../menuInsert/newPseudo.js";
import { newPass } from "../menuInsert/newPass.js";
import { newTwoFa } from "../menuInsert/newTwoFa.js";
import {ChangeUsername} from "../auth/change-username.js";
import {ChangePassword} from "../auth/change-password.js";
import {Add2FA, Remove2FA} from "../auth/toggle-2fa.js";
import { removeTwoFa } from "../menuInsert/removeTwoFa.js";

import { getUser } from "../user-handler.js";
import { viewManager } from "./viewManager.js";
import { Component } from "../component.js";

export class SettingsView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    
    private handleNewPseudo = () => this.newPseudo();
    private handleNewPassword = () => this.newPassword();
    private handleToggle2FA = () => this.toggle2FA();
    private handleSettings = () => this.viewManager.show('settings');
    private handleSettingsReturn = () => this.viewManager.show('parametre');
    private handlePseudoReturn = () => this.viewManager.show('settings');

    constructor(containerId: HTMLElement, viewManager: viewManager) {
        this.container = containerId;
        this.viewManager = viewManager;
    }

    public init(): void{
        this.container.innerHTML = '';
        this.container.innerHTML = settings();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('newPseudo')?.addEventListener('click', this.handleNewPseudo);
        document.getElementById('newPass')?.addEventListener('click', this.handleNewPassword);
        document.getElementById('toggle-2fa')?.addEventListener('change', this.handleToggle2FA);
        document.getElementById('settings')?.addEventListener('click', this.handleSettings);
        document.getElementById('settingsReturnBtn')?.addEventListener('click', this.handleSettingsReturn);
    }

    private newPseudo() {

        this.container.insertAdjacentHTML('beforeend', newPseudo());
        const changeUsername = new ChangeUsername();
        changeUsername.init();
        document.getElementById('pseudoReturnBtn')?.addEventListener('click', this.handlePseudoReturn);
    }

    private newPassword(){
        this.container.insertAdjacentHTML('beforeend', newPass());
        const changePassword = new ChangePassword();
        changePassword.init();
        document.getElementById('passReturnBtn')?.addEventListener('click', this.handlePseudoReturn);

    }

    private toggle2FA() {
        if (getUser()?.tfa) {
            this.remove2fa();
            return;
        }
        else if (getUser()?.tfa === false) {
            this.new2fa();
            return;
        }
    }

    private new2fa(){
        this.container.insertAdjacentHTML('beforeend', newTwoFa());
        const add2FA = new Add2FA();
        add2FA.init();
        document.getElementById('2faReturnBtn')?.addEventListener('click', this.handlePseudoReturn);

    }

    private remove2fa() {
        this.container.insertAdjacentHTML('beforeend', removeTwoFa());
        const remove2FA = new Remove2FA();
        remove2FA.init();
        document.getElementById('2faReturnBtn')?.addEventListener('click', this.handlePseudoReturn);

    }

    public destroy(): void {
        document.getElementById('newPseudo')?.removeEventListener('click', this.handleNewPseudo);
        document.getElementById('newPass')?.removeEventListener('click', this.handleNewPassword);
        document.getElementById('toggle-2fa')?.removeEventListener('change', this.handleToggle2FA);
        document.getElementById('settingsReturnBtn')?.removeEventListener('click', this.handleSettingsReturn);
        document.getElementById('settings')?.removeEventListener('click', this.handleSettings);
        document.getElementById('pseudoReturnBtn')?.removeEventListener('click', this.handlePseudoReturn);
    }
}

import { settings } from "../menuInsert/Settings/settings.js";
import { newPseudo } from "../menuInsert/Settings/newPseudo.js";
import { newPass } from "../menuInsert/Settings/newPass.js";
import { newTwoFa } from "../menuInsert/Settings/newTwoFa.js";
import {ChangeUsername} from "../auth/change-username.js";
import {ChangePassword} from "../auth/change-password.js";
import {Add2FA, Remove2FA} from "../auth/toggle-2fa.js";
import { removeTwoFa } from "../menuInsert/Settings/removeTwoFa.js";

import { getUser } from "../user-handler.js";
import { viewManager } from "./viewManager.js";
import { Component } from "../component.js";
import {router} from "../router.js";

export class SettingsView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private setting: string | null;
    
    private handleSubmit = () => router.navigateTo("/game#settings", this.viewManager);
    private handleNewPseudo = () => this.newPseudo();
    private handleNewPassword = () => this.newPassword();
    private handleToggle2FA = () => this.toggle2FA();
    private handleParametreReturn = () => router.navigateTo("/game#parametre", this.viewManager);
    private handleSettingsReturn = () => router.navigateTo("/game#settings", this.viewManager);

    constructor(containerId: HTMLElement, viewManager: viewManager, setting: string | null) {
        this.container = containerId;
        this.viewManager = viewManager;
        this.setting = setting;
    }

    public init(): void{
        this.container.innerHTML = '';
        this.container.innerHTML = settings();
        this.attachEventListeners();

        if (getUser()?.tfa) {
            const checkbox = document.getElementById('toggle-2fa') as HTMLInputElement | null
            if (checkbox)
                checkbox.checked = true
        }
    }

    private attachEventListeners() {
        if (this.setting) {
            switch (this.setting) {
                case "change-name":
                    this.handleNewPseudo();
                    return;
                case "change-password":
                    this.handleNewPassword();
                    return;
                case "toggle-2fa":
                    this.handleToggle2FA();
                    return;
            }
        }
        document.getElementById('newPseudo')?.addEventListener('click', this.handleNewPseudo);
        document.getElementById('newPass')?.addEventListener('click', this.handleNewPassword);
        document.getElementById('toggle-2fa')?.addEventListener('change', this.handleToggle2FA);
        document.getElementById('settingsReturnBtn')?.addEventListener('click', this.handleParametreReturn);
    }

    private newPseudo() {
        this.container.innerHTML = '';
        this.container.insertAdjacentHTML('beforeend', newPseudo());
        const changeUsername = new ChangeUsername();
        changeUsername.init();
        document.getElementById('submit-username')?.addEventListener('click', this.handleSubmit);
        document.getElementById('pseudoReturnBtn')?.addEventListener('click', this.handleSettingsReturn);
    }

    private newPassword(){
        this.container.innerHTML = '';
        this.container.insertAdjacentHTML('beforeend', newPass());
        const changePassword = new ChangePassword();
        changePassword.init();
        document.getElementById('submit-new-password')?.addEventListener('click', this.handleSubmit);
        document.getElementById('passReturnBtn')?.addEventListener('click', this.handleSettingsReturn);

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
        this.container.innerHTML = '';
        this.container.insertAdjacentHTML('beforeend', newTwoFa());
        const add2FA = new Add2FA();
        add2FA.init();
        document.getElementById('2faReturnBtn')?.addEventListener('click', this.handleSettingsReturn);

    }

    private remove2fa() {
        this.container.innerHTML = '';
        this.container.insertAdjacentHTML('beforeend', removeTwoFa());
        const remove2FA = new Remove2FA();
        remove2FA.init();
        document.getElementById('2faReturnBtn')?.addEventListener('click', this.handleSettingsReturn);

    }

    public destroy(): void {
        document.getElementById('submit-username')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('submit-new-password')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('newPseudo')?.removeEventListener('click', this.handleNewPseudo);
        document.getElementById('newPass')?.removeEventListener('click', this.handleNewPassword);
        document.getElementById('toggle-2fa')?.removeEventListener('change', this.handleToggle2FA);
        document.getElementById('settingsReturnBtn')?.removeEventListener('click', this.handleParametreReturn);
        document.getElementById('pseudoReturnBtn')?.removeEventListener('click', this.handleSettingsReturn);
        document.getElementById('passReturnBtn')?.removeEventListener('click', this.handleSettingsReturn);
        document.getElementById('2faReturnBtn')?.removeEventListener('click', this.handleSettingsReturn);
    }
}

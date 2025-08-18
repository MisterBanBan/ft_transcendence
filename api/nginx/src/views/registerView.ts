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
    private componentStorage?: Component;

    private handleSubmit = () => this.submit_registerForm();
    private handleLogin = () =>  router.navigateTo("/game#login", this.viewManager);

    constructor(container: HTMLElement, private formspicture: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.componentStorage?.destroy();
        this.container.innerHTML = '';
        this.container.innerHTML = registerForm();
        this.componentStorage = new Register();
        this.componentStorage.init();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('submit-register')?.addEventListener('click', this.handleSubmit);
        document.getElementById('loginBtn')?.addEventListener('click', this.handleLogin);
    }
    
    public async submit_registerForm() {
        await wait(1000);

        if (getUser()) {
            router.navigateTo("/game", this.viewManager);
            this.viewManager.setPicture();
        }
    }

    public destroy(): void {
        this.componentStorage?.destroy();
        document.getElementById('submit-register')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('loginBtn')?.removeEventListener('click', this.handleLogin);
    }
}
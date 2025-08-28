import { viewManager } from "./viewManager.js";
import {setUser} from "../route/user-handler.js";
import { twoFApopUp } from "../menuInsert/Connection/twoFApopUp.js";
import {TFAValidate} from "../auth/2fa-validate.js";
import { loginForm } from "../menuInsert/Connection/loginForm.js";
import { Component } from "../route/component.js";
import {router} from "../route/router.js";
import {AuthUser} from "../route/type.js";


export class loginView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private token: string | null;
    private tfaValidate: TFAValidate | null;

    private handleSubmit = (event: Event) => this.submit_loginForm(event);
    private handleRegister = () => router.navigateTo("/game#register", this.viewManager);

    constructor(container: HTMLElement,  viewManager: viewManager, token: string | null) {
        this.container = container;
        this.viewManager = viewManager;
        this.token = token
        this.tfaValidate = null;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = loginForm();
        this.attachEventListeners();

        if (this.token) {
            this.container.insertAdjacentHTML('beforeend', twoFApopUp());
            this.tfaValidate = new TFAValidate(this.token);
            this.tfaValidate.init()
        }
    }

    private attachEventListeners() {
        document.getElementById('submit-login')?.addEventListener('click', this.handleSubmit);
        document.getElementById('registerBtn')?.addEventListener('click', this.handleRegister);

    }

    public async submit_loginForm(event: Event) {
        event.preventDefault();

        const usernameInput = document.getElementById("username-login") as HTMLInputElement | null;
        const passwordInput = document.getElementById("password-login") as HTMLInputElement | null;

        if (!usernameInput || !passwordInput) {
            console.error("One or multiple form's fields are missing.");
            return;
        }

        const body = {
            username: usernameInput.value,
            password: passwordInput.value,
        } as { username: string, password: string };

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });

            let data = await response.json();

            if (data.status === "2FA-REQUIRED") {
                this.container.insertAdjacentHTML('beforeend', twoFApopUp());
                if (this.tfaValidate)
                    this.tfaValidate.destroy();
                this.tfaValidate = new TFAValidate(data.token);
                this.tfaValidate.init();
                return;
            }

            if (data.status === "LOGGED-IN") {
                const user: AuthUser = {
                    id: data.user.id,
                    username: data.user.username,
                    avatar_url: data.user.avatar_url,
                    provider: data.user.provider,
                    provider_id: data.user.provider_id,
                    tfa: Boolean(data.user.tfa),
                    updatedAt: data.user.updatedAt
                }
                setUser(user);
                router.navigateTo("/game")
                this.viewManager.setPicture();
                return;
            }

            if (!response.ok) {

                const errorDiv = document.getElementById('form-login-error');
                if (!errorDiv) {
                    console.error("Can't display error");
                    return;
                }
                errorDiv.textContent = data.message;
                return;
            }

        } catch (err) {
            console.error(err);
        }
    }

    public destroy(): void {
        document.getElementById('submit-login')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('registerBtn')?.removeEventListener('click', this.handleRegister);

        if (this.tfaValidate)
            this.tfaValidate.destroy()
    }
}
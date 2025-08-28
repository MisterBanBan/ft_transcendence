import { viewManager } from "./viewManager.js";
import { registerForm } from "../menuInsert/Connection/registerForm.js";
import {setUser} from "../route/user-handler.js";
import { Component } from "../route/component.js";
import {router} from "../route/router.js";
import {AuthUser} from "../route/type.js";

export class registerView implements Component {
    private container: HTMLElement;
    private readonly viewManager: viewManager;
    private componentStorage?: Component;

    private handleSubmit = (event: Event) => this.submit_registerForm(event);
    private handleLogin = () =>  router.navigateTo("/game#login", this.viewManager);

    constructor(container: HTMLElement, private formspicture: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.componentStorage?.destroy();
        this.container.innerHTML = '';
        this.container.innerHTML = registerForm();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('submit-register')?.addEventListener('click', this.handleSubmit);
        document.getElementById('loginBtn')?.addEventListener('click', this.handleLogin);
    }
    
    public async submit_registerForm(event: Event) {
        event.preventDefault();

        const usernameInput = document.getElementById("username-register") as HTMLInputElement | null;
        const passwordInput = document.getElementById("password-register") as HTMLInputElement | null;
        const cpasswordInput = document.getElementById("cpassword") as HTMLInputElement | null;

        if (!usernameInput || !passwordInput || !cpasswordInput) {
            console.error("One or multiple form's fields are missing.");
            return;
        }

        const auth = {
            username: usernameInput.value,
            password: passwordInput.value,
            cpassword: cpasswordInput.value
        } as { username: string, password: string, cpassword: string };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(auth)
            });

            const data = await response.json();

            if (!response.ok) {

                const errorDiv = document.getElementById('form-register-error');
                if (!errorDiv) {
                    console.error("Can't display error");
                    return;
                }
                errorDiv.textContent = data.message;
                return;
            }

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
            router.navigateTo("/game");
            this.viewManager.setPicture();

        } catch (err) {
            console.error(err);
        }
    }

    public destroy(): void {
        document.getElementById('submit-register')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('loginBtn')?.removeEventListener('click', this.handleLogin);
    }
}
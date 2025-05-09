import {showError} from "./show_errors.js";
import { Component } from "../component.js";

interface Payload {
    email: string;
    password: string;
}

export class Login implements Component{

    private submitButton = document.getElementById("submit-login");

    constructor() {}

    public init(): void {
        if (this.submitButton) {
            this.submitButton.addEventListener("click", async (event) => {
                await submitForm();
                console.log("Button clicked");
            });
        } else {
            console.error("Submit button not found!");
        }

        async function submitForm() {

            const emailInput = document.getElementById("email-login") as HTMLInputElement;
            const passwordInput = document.getElementById("password-login") as HTMLInputElement;
            let errorSpan = document.getElementById("error-global-login") as HTMLTextAreaElement;

            const email: string = emailInput.value;
            const password: string = passwordInput.value;
            const body = {email, password} as Payload;

            try {
                const response = await fetch("https://localhost:8443/api/auth/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body),
                });

                await showError(response, "login");

            } catch (err) {
                console.error("Erreur réseau", err);
                errorSpan.style.display = "block";
                errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
            }
        }
    }

    public destroy(): void {
        this.submitButton?.removeEventListener("click", async (event) => {})
    }
}
import {showError} from "./show_errors.js";
import { Component } from "../component.js";

interface Payload {
	username: string;
	password: string;
	code: string;
}

export class Login implements Component{

	private submitButton = document.getElementById("submit-login");

	constructor() {}

	public init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", async (event) => {
				await submitForm();
			});
		} else {
			console.error("Submit button not found!");
		}

		async function submitForm() {

			const usernameInput = document.getElementById("username-login") as HTMLInputElement;
			const passwordInput = document.getElementById("password-login") as HTMLInputElement;
			const codeInput = document.getElementById("code") as HTMLInputElement;
			let errorSpan = document.getElementById("error-global-login") as HTMLTextAreaElement;

			const username: string = usernameInput.value;
			const password: string = passwordInput.value;
			const code: string = codeInput.value;
			const body = {username, password, code} as Payload;

			try {
				const response = await fetch("/api/auth/login", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(body),
				});

				if (!response.ok)
					return await showError(response, "login");

				document.querySelectorAll(`.error-message-login`).forEach(errorSpan => errorSpan.innerHTML = "");

			} catch (err) {
				console.error("Error: ", err);
				errorSpan.style.display = "block";
				errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
			}
		}
	}

	public destroy(): void {
		this.submitButton?.removeEventListener("click", async (event) => {})
	}
}
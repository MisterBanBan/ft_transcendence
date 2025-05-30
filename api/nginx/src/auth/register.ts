import {showError} from "./show_errors.js";
import { Component } from "../component.js";

interface Payload {
	username: string;
	password: string;
	cpassword: string;
}

export class Register implements Component{

	private submitButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;

	constructor() {
		this.handleSubmitBound = this.handleSubmit.bind(this);
	}

	public init() {
		this.submitButton = document.getElementById("submit-register");

		if (!this.submitButton) {
			console.error("Submit button not found!");
			return;
		}

		this.submitButton.addEventListener("click", this.handleSubmitBound);
	}

	private async handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		const usernameInput = document.getElementById("username-register") as HTMLInputElement | null;
		const passwordInput = document.getElementById("password-register") as HTMLInputElement | null;
		const cpasswordInput = document.getElementById("cpassword") as HTMLInputElement | null;
		const errorSpan = document.getElementById("error-global-register") as HTMLTextAreaElement | null;

		if (!usernameInput || !passwordInput || !cpasswordInput || !errorSpan) {
			console.error("One or multiple form's fields are missing.");
			return;
		}

		const auth: Payload = {
			username: usernameInput.value,
			password: passwordInput.value,
			cpassword: cpasswordInput.value
		};

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(auth)
			});

			const data = await response.json();

			if (!response.ok) {
				document.querySelectorAll(`.error-message-register`).forEach(el => el.textContent = "");

				const error = document.createElement(`error-${data.type}-register`);
				if (!error) {
					console.error("Can't display error");
					return;
				}
				error.textContent = data.error;
				return;
			}

			window.location.href = '/';
		} catch (err) {
			console.error("Error: ", err);
			errorSpan.textContent = 'Erreur de connexion au serveur.';
		}
	}

	public destroy() {
		if (this.submitButton)
			this.submitButton.removeEventListener("click", this.handleSubmitBound)
	}
}

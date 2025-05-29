import {showError} from "./show_errors.js";
import { Component } from "../component.js";

interface Payload {
	username: string;
	password: string;
}

interface TfaPayload {
	token: string;
	code: string;
}

export class Login implements Component{

	private submitButton: HTMLElement | null = null;
	private submit2FAButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;
	private handleSubmit2FABoundWrapper?: (event: Event) => void;

	constructor() {
		this.handleSubmitBound = this.handleSubmit.bind(this);
	}

	public init(): void {
		this.submitButton = document.getElementById("submit-login");

		if (!this.submitButton) {
			console.error("Submit button not found!");
			return;
		}

		this.submitButton.addEventListener("click", this.handleSubmitBound);
	}

	private async handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		const usernameInput = document.getElementById("username-login") as HTMLInputElement | null;
		const passwordInput = document.getElementById("password-login") as HTMLInputElement | null;
		let errorSpan = document.getElementById("error-global-login") as HTMLTextAreaElement | null;

		if (!usernameInput || !passwordInput || !errorSpan) {
			console.error("One or multiple form's fields are missing.");
			return;
		}

		const body: Payload = {
			username: usernameInput.value,
			password: passwordInput.value,
		};

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body),
			});

			let data = await response.json();

			if (data.status === "2FA-REQUIRED") {
				await this.handle2FA(data.token, errorSpan);
				return;
			}

			if (data.status === "LOGGED-IN") {
				window.location.href = '/'
				return;
			}

			if (!response.ok) {
				await showError(data, "login", response.ok);
				return;
			}

		} catch (err) {
			console.error("Error: ", err);
			errorSpan.style.display = "block";
			errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
		}
	}

	private async handle2FA(token: string, errorSpan: HTMLElement): Promise<void> {
		const popup = document.getElementById('popup-2fa');

		if (!popup) {
			errorSpan.innerText = "Can't access to the 2FA verification";
			console.error("Missing 2fa popup.");
			return;
		}

		this.submit2FAButton = document.getElementById("submit-2fa");
		if (!this.submit2FAButton) {
			errorSpan.innerText = "Can't access to the 2FA verification";
			console.error("Missing submit button for 2FA verification.");
			return;
		}

		if (this.handleSubmit2FABoundWrapper) {
			this.submit2FAButton.removeEventListener('click', this.handleSubmit2FABoundWrapper);
		}

		this.handleSubmit2FABoundWrapper = (event: Event) => this.handleSubmit2FA(event, token);

		this.submit2FAButton.addEventListener("click", this.handleSubmit2FABoundWrapper);

		popup.classList.remove('hidden');
	}

	private async handleSubmit2FA(event: Event, token: string): Promise<void> {
		event.preventDefault()

		const codeInput = document.getElementById('popup-2fa-code') as HTMLInputElement | null;
		if (!codeInput) {
			console.error("Code field is missing.");
			return;
		}

		const tfaPayload: TfaPayload = {
			token: token,
			code: codeInput.value
		};

		try {
			const response = await fetch("/api/auth/2fa/validate", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(tfaPayload),
			});

			const data = await response.json();

			if (!response.ok) {
				await showError(data, "2fa", response.ok)
				return;
			}

			if (data.success) {
				window.location.href = '/'
				return;
			}
		} catch (e) {
			console.error("Error during 2FA validation:", e)
		}
	}

	public destroy(): void {
		if (this.submitButton)
			this.submitButton.removeEventListener("click", this.handleSubmitBound)

		if (this.submit2FAButton && this.handleSubmit2FABoundWrapper)
			this.submit2FAButton.removeEventListener("click", this.handleSubmit2FABoundWrapper);
	}
}
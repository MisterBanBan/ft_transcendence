import { Component } from "../component.js";
import { AuthUser } from "../type.js";
import { setUser } from "../user-handler.js";

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

		if (!usernameInput || !passwordInput) {
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

			console.log("Request login:", data.status);

			if (data.status === "2FA-REQUIRED") {
				await this.handle2FA(data.token);
				return;
			}

			if (data.status === "LOGGED-IN") {
				console.log("User logged in successfully.");
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

	private async handle2FA(token: string): Promise<void> {
		const popup = document.getElementById('popup-2fa');

		if (!popup) {
			console.error("Missing 2fa popup.");
			return;
		}

		this.submit2FAButton = document.getElementById("submit-2fa");
		if (!this.submit2FAButton) {
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

	private async handleSubmit2FA(event: Event, token: string) {
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
				const errorDiv = document.getElementById('popup-2fa-error')
				if (!errorDiv) {
					console.error("Can't display error");
					return;
				}

				errorDiv.textContent = data.message;
				return;
			}

			if (data.success) {
				return window.location.href = '/';
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
import { Component } from "../component.js";
import { AuthUser } from "../type.js";
import { set2faPlaceholder, setUser } from "../user-handler.js";

interface Payload {
	username: string;
	password: string;
}

export class Login implements Component{

	private submitButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;

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

				set2faPlaceholder(data.token);
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

	public destroy(): void {
		if (this.submitButton)
			this.submitButton.removeEventListener("click", this.handleSubmitBound)
	}
}
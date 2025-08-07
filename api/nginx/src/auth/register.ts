import { Component } from "../component.js";
import { AuthUser } from "../type.js";
import {getUser, setUser} from "../user-handler.js";

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

		if (!usernameInput || !passwordInput || !cpasswordInput) {
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
			
		} catch (err) {
			console.error(err);
		}
	}

	public destroy() {
		if (this.submitButton)
			this.submitButton.removeEventListener("click", this.handleSubmitBound)
	}
}

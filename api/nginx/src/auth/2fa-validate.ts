import {Component} from "../route/component";
import {router} from "../route/router.js";
import {AuthUser} from "../route/type.js";
import {setUser} from "../route/user-handler.js";
import {viewManager} from "../views/viewManager.js";

export class TFAValidate implements Component {

	private readonly handleSubmitBound: (event: Event) => void;

	private handleReturn = () => router.navigateTo("/game#login");

	private submitButton = document.getElementById("submit-2fa") as HTMLButtonElement | null;
	private readonly token: string | null = null;

	constructor(token: string | null = null) {
		this.handleSubmitBound = this.handleSubmit.bind(this);
		this.token = token;
	}

	destroy(): void {
		if (this.submitButton) {
			this.submitButton.removeEventListener("click", this.handleSubmitBound);
		}

		document.getElementById('2faReturnBtn')?.removeEventListener('click', this.handleReturn);
	}

	init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", this.handleSubmitBound);
		} else {
			console.error("Submit button not found!");
		}

		document.getElementById('2faReturnBtn')?.addEventListener('click', this.handleReturn);
	}

	private async handleSubmit(event: Event) {
		event.preventDefault();

		const codeInput = document.getElementById("code-2fa") as HTMLInputElement;

		let tempToken: string;
		if (this.token) {
			tempToken = this.token;
		} else {
			const urlParams = new URLSearchParams(window.location.search);
			tempToken = urlParams.get('token') || '';
		}
		
		const payload = {
			token: tempToken,
			code: codeInput.value,
		} as { token: string, code: string };

		try {
			let response = await fetch("/api/auth/2fa/validate", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				const error = document.getElementById(`popup-2fa-error`)
				if (!error) {
					console.error("Can't display error:", data.message);
					return;
				}

				error.textContent = data.message;
				return;
			}

			setUser(data as AuthUser);
			router.navigateTo("/game");
			
			return;

		} catch (error) {
			console.error(error);
		}
	}

}
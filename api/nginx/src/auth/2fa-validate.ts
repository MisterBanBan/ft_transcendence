import {Component} from "../component";

export class TFAValidate implements Component {

	private readonly handleSubmitBound: (event: Event) => void;
	private submitButton = document.getElementById("submit-2fa") as HTMLInputElement | null;
	private token: string | null = null;

	constructor(token: string | null = null) {
		this.handleSubmitBound = this.handleSubmit.bind(this);
		this.token = token;
	}

	destroy(): void {
		if (this.submitButton) {
			this.submitButton.removeEventListener("click", async (event) => {});
		}
	}

	init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", this.handleSubmitBound);
		} else {
			console.error("Submit button not found!");
		}
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
			const response = await fetch("/api/auth/2fa/validate", {
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
			
			return;

		} catch (error) {
			console.error(error);
		}
	}

}
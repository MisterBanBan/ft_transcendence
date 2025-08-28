import {Component} from "../route/component";
import {router} from "../route/router.js";
import {AuthUser} from "../route/type.js";
import {setUser} from "../route/user-handler.js";

export class TFAValidate implements Component {

	private readonly handleSubmitBound: (event: Event) => void;

	private handleReturn = () => router.navigateTo("/game#login");

	private submitButton = document.getElementById("submit-2fa") as HTMLButtonElement | null;
	private token: string | null = null;

	constructor(token: string | null = null) {
		this.handleSubmitBound = this.handleSubmit.bind(this);
		this.token = token;
		console.log(this.token)
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

		console.log(this.token);
		console.log(tempToken)
		
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

			response = await fetch("/api/auth/verify", {
				method: "GET",
			});

			if (response.ok) {
				const data: AuthUser | undefined = await response.json();
				if (data)
					setUser(data);
			}

			router.navigateTo("/game");
			
			return;

		} catch (error) {
			console.error(error);
		}
	}

}
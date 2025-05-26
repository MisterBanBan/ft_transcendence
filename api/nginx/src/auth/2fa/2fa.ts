import {Component} from "../../component.js";
import {showError} from "../show_errors.js";

export class TFA implements Component {

	private submitButton = document.getElementById("submit");

	destroy(): void {
		if (this.submitButton) {
			this.submitButton.removeEventListener("click", async (event) => {});
		}
	}

	init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", async (event) => {
				await submit();
			});
		} else {
			console.error("Submit button not found!");
		}

		async function submit() {
			const codeInput = document.getElementById("2fa-code") as HTMLInputElement;

			const urlParams = new URLSearchParams(window.location.search);
			const tempToken = urlParams.get('token');

			const code = codeInput.value;
			const payload = { token: tempToken, code } as { token: string, code: string };

			try {
				const response = await fetch("/api/auth/2fa/validate", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(payload),
				});

				const data = await response.json();

				if (!response.ok)
					return await showError(data, "2fa", response.ok);

				if (data.success)
				{
					console.log("Redirecting to /.");
					return window.location.href = '/';
				}


			} catch (error) {
				console.error(error);
			}
		}
	}

}
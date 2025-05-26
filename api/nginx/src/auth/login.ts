import {showError} from "./show_errors.js";
import { Component } from "../component.js";

interface Payload {
	username: string;
	password: string;
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
			let errorSpan = document.getElementById("error-global-login") as HTMLTextAreaElement;

			const username: string = usernameInput.value;
			const password: string = passwordInput.value;
			const body = {username, password} as Payload;

			try {
				const response = await fetch("/api/auth/login", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(body),
				});

				const data = await response.json();

				if (data.status === "2AF-REQUIRED") {
					const popup = document.getElementById('popup-2fa');
					if (!popup) {
						errorSpan.innerText = "Can't access to the 2FA verification";
						return;
					}

					popup.removeEventListener('click', async (event) => {});
					popup.addEventListener("click", async (event) => {
						const code = (document.getElementById('popup-2fa-code') as HTMLInputElement).value;
						const tfaPayload = { token: data.token, code } as { token: string, code: string }

						const response = await fetch("/api/auth/2fa/validate", {
							method: "POST",
							headers: {"Content-Type": "application/json"},
							body: JSON.stringify(tfaPayload),
						});

						if (!response.ok)
							return await showError(await response.json(), "2fa", response.ok);

						if (data.success)
						{
							console.log("Redirecting to /.");
							return window.location.href = '/';
						}
					});
					popup.classList.remove('hidden');
				}
				else if (data.status === "LOGGED-IN")
					return

				if (!response.ok)
					return await showError(data, "login", response.ok);

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
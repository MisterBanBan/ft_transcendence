import {showError} from "./show_errors.js";
import { Component } from "../component.js";

interface Payload {
	username: string;
	password: string;
	cpassword: string;
}

export class Register implements Component{

	private submitButton = document.getElementById("submit-register");

	constructor() {}

	public init() {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", async (event) => {
				await submitForm();
				console.log("Button clicked");
			});
		} else {
			console.error("Submit button not found!");
		}

		async function submitForm() {

			const usernameInput = document.getElementById("username-register") as HTMLInputElement;
			const passwordInput = document.getElementById("password-register") as HTMLInputElement;
			const cpasswordInput = document.getElementById("cpassword") as HTMLInputElement;
			let errorSpan = document.getElementById("error-global-register") as HTMLTextAreaElement;

			const username = usernameInput.value;
			const password = passwordInput.value;
			const cpassword = cpasswordInput.value;
			const auth = { username, password, cpassword } as Payload;

			try {
				const response = await fetch("/api/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(auth)
				});

				await showError(response, "register");

			} catch (err) {
				console.error("Erreur réseau", err);
				errorSpan.style.display = "block";
				errorSpan.innerHTML = `<span>Erreur de connexion au serveur.</span>`;
			}
		}
	}

	public destroy() {
		this.submitButton?.removeEventListener("click", async (event) => {})
	}
}

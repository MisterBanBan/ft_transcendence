import { Component } from "../component.js";

interface Payload {
	username: string;
	password: string;
}

export class ChangeUsername implements Component{

	private submitButton = document.getElementById("submit-username");

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

			// const usernameInput = document.getElementById("username-login") as HTMLInputElement;
			// const passwordInput = document.getElementById("password-login") as HTMLInputElement;
			//
			// const username: string = usernameInput.value;
			// const password: string = passwordInput.value;
			// const body = {username, password} as Payload;

			try {
				const response = await fetch("/api/auth/change-username", {
					method: "POST",
					// headers: {"Content-Type": "application/json"},
					// body: JSON.stringify(body),
				});
				// const data = await response.json();

			} catch (err) {
				console.error("Error: ", err);
			}
		}
	}

	public destroy(): void {
		this.submitButton?.removeEventListener("click", async (event) => {})
	}
}
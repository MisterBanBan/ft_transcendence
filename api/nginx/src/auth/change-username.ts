import { Component } from "../component.js";

interface Payload {
	newUsername: string;
	password: string;
}

export class ChangeUsername implements Component{

	private submitButton = document.getElementById("submit-username");

	public init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", async (event) => {
				await submitForm();
			});
		} else {
			console.error("Submit button not found!");
		}

		async function submitForm() {

			const usernameInput = document.getElementById("username") as HTMLInputElement;
			const passwordInput = document.getElementById("password") as HTMLInputElement;

			const username: string = usernameInput.value;
			const password: string = passwordInput.value;
			const body = {newUsername: username, password} as Payload;

			try {
				const response = await fetch("/api/auth/change-username", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(body),
				});
				const data = await response.json();

				console.log(data);

			} catch (err) {
				console.error("Error: ", err);
			}
		}
	}

	public destroy(): void {
		this.submitButton?.removeEventListener("click", async (event) => {})
	}
}
import { Component } from "../component.js";

interface Payload {
	newUsername: string;
}

export class ChangeUsername implements Component{

	private submitButton = document.getElementById("submit-username");

	public init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", async (event) => {
				event.preventDefault();
				await submitForm();
			});
		} else {
			console.error("Submit button not found!");
		}

		async function submitForm() {

			const usernameInput = document.getElementById("username") as HTMLInputElement | null;

			if (!usernameInput) {
				console.error("Username input is missing.");
				return;
			}
			const body: Payload = {
				newUsername: usernameInput.value.trim()
			};

			try {
				const response = await fetch("/api/auth/change-username", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(body),
				});
				const data = await response.json();

				if (!response.ok) {
					const error = document.getElementById("error-username")
					if (!error) {
						console.error("Can't display error");
						return;
					}

					error.textContent = data.message;
					return;
				} 

			} catch (err) {
				console.error("Error: ", err);
			}
		}
	}

	public destroy(): void {
		this.submitButton?.removeEventListener("click", async (event) => {})
	}
}
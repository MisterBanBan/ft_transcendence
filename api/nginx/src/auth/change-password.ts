import { Component } from "../component.js";

interface Payload {
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

export class ChangePassword implements Component{

	private submitButton = document.getElementById("submit-new-password");

	public init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", async (event) => {
				await submitForm();
			});
		} else {
			console.error("Submit button not found!");
		}

		async function submitForm() {

			const currentPasswordInput = document.getElementById("current_password") as HTMLInputElement;
			const newPassInput = document.getElementById("new_password") as HTMLInputElement;
			const confirmNewPassInput = document.getElementById("confirm_new_password") as HTMLInputElement;

			const currentPassword: string = currentPasswordInput.value;
			const newPassword: string = newPassInput.value;
			const confirmNewPassword: string = confirmNewPassInput.value;
			const body = {currentPassword: currentPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword} as Payload;

			try {
				const response = await fetch("/api/auth/change-password", {
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
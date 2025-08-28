import { Component } from "../route/component.js";
import {router} from "../route/router.js";

interface Payload {
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

export class ChangePassword implements Component{

	private submitButton = document.getElementById("submit-new-password");

	public init(): void {
		if (this.submitButton) {
			this.submitButton.addEventListener("click", this.submitForm);
		} else {
			console.error("Submit button not found!");
		}
	}

	private async submitForm(event: Event) {
		event.preventDefault()

		const currentPasswordInput = document.getElementById("current_password") as HTMLInputElement | null;
		const newPasswordInput = document.getElementById("new_password") as HTMLInputElement | null;
		const confirmNewPasswordInput = document.getElementById("confirm_new_password") as HTMLInputElement | null;

		if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
			const error = document.getElementById('error-password');
			if (error) error.textContent = "Tous les champs sont obligatoires !";
			return;
		}

		const body: Payload = {
			currentPassword: currentPasswordInput.value,
			newPassword: newPasswordInput.value,
			confirmNewPassword: confirmNewPasswordInput.value
		};

		try {
			const response = await fetch("/api/auth/change-password", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body),
			});
			const data = await response.json();

			if (!response.ok) {
				const error = document.getElementById('error-password')
				if (!error) {
					console.error("Can't display error");
					return;
				}

				error.textContent = data.message;
				return;
			}

			router.navigateTo("/game#settings");

		} catch (err) {
			console.error("Error: ", err);
		}
	}

	public destroy(): void {
		this.submitButton?.removeEventListener("click", this.submitForm)
	}
}
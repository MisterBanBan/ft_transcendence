import {Component} from "../route/component.js";
import {router} from "../route/router.js";
import {set2FA} from "../route/user-handler.js";

interface Payload {
	code: string;
	password: string | undefined;
}

async function handleSubmit(event: Event, toggle: boolean): Promise<void> {
	event.preventDefault();

	let codeInput;
	let passwordInput;
	let requestUrl;
	let errorId;
	switch (toggle) {
		case true: {
			codeInput = document.getElementById("2fa-code") as HTMLInputElement | null;
			passwordInput = document.getElementById("2fa-password") as HTMLInputElement | null;
			requestUrl = "/api/auth/2fa/create";
			errorId = "error-add-2fa";
			break;
		}
		case false: {
			codeInput = document.getElementById("2fa-code-remove") as HTMLInputElement | null;
			passwordInput = document.getElementById("2fa-password-remove") as HTMLInputElement | null;
			requestUrl = "/api/auth/2fa/remove";
			errorId = "error-remove-2fa";
			break;
		}
	}

	if (!codeInput) {
		console.error("Code field is missing.");
		return;
	}

	let password = undefined;
	if (passwordInput) {
		password = passwordInput.value;
	}

	const body: Payload = {
		code: codeInput.value,
		password: password,
	}

	try {
		const response = await fetch(requestUrl, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			const error = document.getElementById(errorId)
			if (!error) {
				console.error("Can't display error");
				return;
			}

			error.textContent = data.message;
			return;
		}

		set2FA(toggle)
		router.navigateTo("/game#settings");

	} catch (err) {
		console.error(err);
	}
}

export class Add2FA implements Component {

	private submitButton: HTMLInputElement | null = null;
	private onSubmitBoundWrapper?: (event: Event) => void;

	public async init(): Promise<void> {
		this.submitButton = document.getElementById("2fa-submit") as HTMLInputElement | null;

		if (!this.submitButton) {
			console.error("Submit button not found!");
			return;
		}

		try {
			const response = await fetch("/api/auth/2fa/create", {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});

			const data = await response.json();

			if (!response.ok) {
				const error = document.getElementById("error-add-2fa")
					if (!error) {
						console.error("Can't display error");
						return;
					}

					error.textContent = data.message;
					return;
			}

			if (response.status === 202) {
				const location = response.headers.get("Location");
				if (location)
					window.location.href = location;
				return;
			}

			const imageElement = document.getElementById('qrCodeImage') as HTMLImageElement;

			if (imageElement) {
				imageElement.src = data.url;
			}

		} catch (err) {
			console.error(err);
			return;
		}

		this.submitButton = document.getElementById("2fa-submit") as HTMLInputElement | null;
		if (!this.submitButton) {
			console.error("Missing submit button.");
			return;
		}

		if (this.onSubmitBoundWrapper) {
			this.submitButton.removeEventListener('click', this.onSubmitBoundWrapper);
		}

		this.onSubmitBoundWrapper = (event: Event) => handleSubmit(event, true);
		this.submitButton.addEventListener("click", this.onSubmitBoundWrapper);
	}

	public destroy(): void {
		if (this.submitButton && this.onSubmitBoundWrapper)
			this.submitButton.removeEventListener("click", this.onSubmitBoundWrapper);
	}
}

export class Remove2FA implements Component {

	private submitButton: HTMLInputElement | null = null;
	private onSubmitBoundWrapper?: (event: Event) => void;

	public async init(): Promise<void> {
		this.submitButton = document.getElementById("2fa-submit-remove") as HTMLInputElement | null;

		if (!this.submitButton) {
			console.error("Submit button not found!");
			return;
		}
	
		try {
			const response = await fetch("/api/auth/2fa/remove", {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});

			const data = await response.json();

			if (!response.ok) {
				const error = document.getElementById("error-remove-2fa")
				if (!error) {
					console.error("Can't display error");
					return;
				}

				error.textContent = data.message;
				return;
			}

			if (response.status === 202) {
				const location = response.headers.get("Location");
				if (location)
					window.location.href = location;
				return;
			}

		} catch (err) {
			console.error(err);
			return;
		}

		this.submitButton = document.getElementById("2fa-submit-remove") as HTMLInputElement | null;
		if (!this.submitButton) {
			console.error("Missing submit button.");
			return;
		}

		if (this.onSubmitBoundWrapper) {
			this.submitButton.removeEventListener('click', this.onSubmitBoundWrapper);
		}

		this.onSubmitBoundWrapper = (event: Event) => handleSubmit(event, false);
		this.submitButton.addEventListener("click", this.onSubmitBoundWrapper);
	}

	public destroy(): void {
		if (this.submitButton && this.onSubmitBoundWrapper)
			this.submitButton.removeEventListener("click", this.onSubmitBoundWrapper);
	}
}
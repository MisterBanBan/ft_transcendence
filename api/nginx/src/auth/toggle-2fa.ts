import {Component} from "../component.js";

interface Payload {
	code: string;
	password: string | undefined;
}

export class Toggle2FA implements Component{

	private toggleSwitch: HTMLInputElement | null = null;
	private submitButton: HTMLInputElement | null = null;
	private readonly onToggleSwitchBound: (event: Event) => void;
	private onSubmitBoundWrapper?: (event: Event) => void;

	constructor() {
		this.onToggleSwitchBound = this.handleToggle.bind(this);
	}

	public init(): void {
		this.toggleSwitch = document.getElementById("toggle-2fa") as HTMLInputElement | null;

		if (!this.toggleSwitch) {
			console.error("Missing toggle switch.");
			return;
		}

		this.toggleSwitch.addEventListener("change", this.onToggleSwitchBound);
	}

	private async handleToggle(event: Event): Promise<void> {
		if (this.toggleSwitch?.checked) {
			const popup = document.getElementById('toggle-2fa-popup') as HTMLDivElement | null;

			if (!popup) {
				console.error("Missing 2fa popup.");
				return;
			}

			try {
				const response = await fetch("/api/auth/2fa/create", {
					method: "GET",
					headers: {"Content-Type": "text/html"},
				});

				const dataUrl = await response.text();

				const imageElement = document.getElementById('qrCodeImage') as HTMLImageElement;

				if (imageElement) {
					imageElement.src = dataUrl;
				}

			} catch (err) {
				console.error("Error: ", err);
			}

			this.submitButton = document.getElementById("2fa-submit") as HTMLInputElement | null;
			if (!this.submitButton) {
				console.error("Missing submit button.");
				return;
			}

			if (this.onSubmitBoundWrapper) {
				this.submitButton.removeEventListener('click', this.onSubmitBoundWrapper);
			}

			this.onSubmitBoundWrapper = (event: Event) => this.handleSubmit(event);
			this.submitButton.addEventListener("click", this.onSubmitBoundWrapper);

			popup.classList.remove("hidden");
		}
	}

	private async handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		const codeInput = document.getElementById("2fa-code") as HTMLInputElement | null;
		const passwordInput = document.getElementById("2fa-password") as HTMLInputElement | null;

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
			const response = await fetch("/api/auth/2fa/create", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(body),
			});

			const text = await response.text();

			if (!response.ok) {
				console.error(text);
				return;
			}

			console.log(text);

		} catch (err) {
			console.error("Error: ", err);
		}
	}

	public destroy(): void {
		if (this.toggleSwitch)
			this.toggleSwitch.removeEventListener("change", this.onToggleSwitchBound)

		if (this.submitButton && this.onSubmitBoundWrapper)
			this.submitButton.removeEventListener("click", this.onSubmitBoundWrapper);
	}
}

//const codeInput = document.getElementById("2fa-code") as HTMLInputElement | null;
// 			const passwordInput = document.getElementById("2fa-password") as HTMLInputElement;
//
// 			if (!codeInput) {
// 				console.error("Code field is missing.");
// 				return;
// 			}
//
// 			let password = undefined;
// 			if (passwordInput) {
// 				password = passwordInput.value;
// 			}
//
// 			const body: Payload = {
// 				code: codeInput.value,
// 				password: password,
// 			}
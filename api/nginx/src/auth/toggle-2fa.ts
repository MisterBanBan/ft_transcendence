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
	private provider: string | null = null;

	constructor() {
		this.onToggleSwitchBound = this.handleToggle.bind(this);
	}

	public init(): void {

		if (window.location.pathname === "/settings")
		{
			this.toggleSwitch = document.getElementById("toggle-2fa") as HTMLInputElement | null;

			if (!this.toggleSwitch) {
				console.error("Missing toggle switch.");
				return;
			}

			this.toggleSwitch.addEventListener("change", this.onToggleSwitchBound);
		}
		else {
			this.handleToggle();
		}
	}

	private async handleToggle(event?: Event): Promise<void> {
		if (this.toggleSwitch?.checked || window.location.pathname === "/2fa/create") {
			const popup = document.getElementById('toggle-2fa-popup') as HTMLDivElement | null;

			if (!popup) {
				console.error("Missing 2fa popup.");
				return;
			}

			try {
				const response = await fetch("/api/auth/2fa/create", {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});

				const data = await response.json();

				if (!response.ok) {
					console.error(data.error);
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
				this.provider = data.provider

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
			if (this.provider != "local")
				passwordInput.remove();
			else
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

			const data = await response.json();

			if (!response.ok) {
				console.error(data.error);
				return;
			}

			window.location.href = "/settings";

		} catch (err) {
			console.error(err);
		}
	}

	public destroy(): void {
		if (this.toggleSwitch)
			this.toggleSwitch.removeEventListener("change", this.onToggleSwitchBound)

		if (this.submitButton && this.onSubmitBoundWrapper)
			this.submitButton.removeEventListener("click", this.onSubmitBoundWrapper);
	}
}
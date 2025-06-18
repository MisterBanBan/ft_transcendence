import {Component} from "../component";

export class CreateTournament implements Component {

	private submitButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;

	constructor() {
		this.handleSubmitBound = this.handleSubmit.bind(this);
	}

	public init(): void {
		this.submitButton = document.getElementById("tournament-submit");

		if (!this.submitButton) {
			console.error("Tournament submit button not found!");
			return;
		}

		this.submitButton.addEventListener("click", this.handleSubmitBound);
	}

	destroy(): void {
		if (this.submitButton)
			this.submitButton.removeEventListener("click", this.handleSubmitBound)
	}

	private async handleSubmit(event: Event) {
		event.preventDefault();

		const nameInput = document.getElementById("tournament-name") as HTMLInputElement;
		const sizeInput = document.getElementById("tournament-size") as HTMLInputElement;

		const name = nameInput.value;
		const size = sizeInput.value;

		const payload = {
			name: name,
			size: parseInt(size)
		} as { name: string, size: number };

		try {
			const response = await fetch("/api/tournament/createTournament", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				// const error = document.getElementById(`popup-2fa-error`)
				// if (!error) {
				// 	console.error("Can't display error");
				// 	return;
				// }

				// error.textContent = data.message;
				console.error(data.message);
				return;
			}

			if (data.success) {
				return window.location.href = '/';
			}

		} catch (error) {
			console.error(error);
		}
	}

}
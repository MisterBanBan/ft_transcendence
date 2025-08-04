import {Component} from "../component.js";
declare const io: any;

export class CreateTournament implements Component {

	private submitButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;

	private readonly socket: any;

	constructor(socket: any) {
		this.socket = socket;

		console.log("Socket:", this.socket);

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

		const nameInput = document.getElementById("tournament-name") as HTMLInputElement | null;
		const sizeInput = document.getElementById("tournament-size") as HTMLInputElement | null;

		if (!nameInput || !sizeInput) {
			console.error("Error: one or multiple fields is missing");
			return;
		}

		const name = nameInput.value;
		const size = sizeInput.value;

		try {

			console.log("Clicked:", this.socket);

			this.socket.emit("create", name, parseInt(size));

		} catch (error) {
			console.error(error);
		}
	}
}

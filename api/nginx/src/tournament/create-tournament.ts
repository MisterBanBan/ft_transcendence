import {Component} from "../component.js";
import EnhancedSocket from "./enhanced-ws.js";
import { sendMessage } from "./ws-utils.js";

declare const io: any;

export class CreateTournament implements Component {

	private submitButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;
	// private socket = io('https://10.13.6.4:8081', {
	// 	transports: ["websocket", "polling"],
	// 	withCredentials: true,
	// });

	private ws: EnhancedSocket;

	constructor(ws: EnhancedSocket) {
		this.ws = ws;

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

		const payload = {
			name: name,
			size: parseInt(size)
		} as { name: string, size: number };

		try {

			console.log("Clicked");

			this.ws.sendAction("createTournament", payload);

			// this.socket.emit('createTournament');
			//
			// this.socket.on('createdTournament', () => {
			// 	console.log("createdTournament");
			// });

			// const response = await fetch("/api/tournament/createTournament", {
			// 	method: "POST",
			// 	headers: {"Content-Type": "application/json"},
			// 	body: JSON.stringify(payload),
			// });
			//
			// const data = await response.json();
			//
			// if (!response.ok) {
			// 	// const error = document.getElementById(`popup-2fa-error`)
			// 	// if (!error) {
			// 	// 	console.error("Can't display error");
			// 	// 	return;
			// 	// }
			//
			// 	// error.textContent = data.message;
			// 	console.error(data.message);
			// 	return;
			// }
			//
			// if (data.success) {
			// 	return window.location.href = '/';
			// }

		} catch (error) {
			console.error(error);
		}
	}
}

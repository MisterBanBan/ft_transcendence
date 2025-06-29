import {Component} from "../component";

declare const io: any;

export class CreateTournament implements Component {

	private submitButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;
	// private socket = io('https://10.13.6.4:8081', {
	// 	transports: ["websocket", "polling"],
	// 	withCredentials: true,
	// });

	private ws = new WebSocket('wss://10.13.6.4:8081/wss/tournament')

	constructor() {
		this.handleSubmitBound = this.handleSubmit.bind(this);

		this.ws.onopen = () => {
			console.log('WebSocket ouvert');
			this.ws.send('Hello from client');
		};
		this.ws.onmessage = (event) => {
			console.log('Message from server:', event.data);
		};
		this.ws.onerror = (e) => {
			console.error('WebSocket error:', e);
		};
		this.ws.onclose = (event) => {
			console.log(event);
			console.log('WebSocket fermé', event.code, event.reason);
		};
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

			console.log("Clicked");

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
import { Component } from "../route/component.js";
import { setUser } from "../route/user-handler.js";
import {logoutChannel, router} from "../route/router.js";

// Removed unused Payload interface

export class Logout implements Component{

	private submitButton: HTMLElement | null = null;
	private readonly handleSubmitBound: (event: Event) => void;

	constructor() {
		this.handleSubmitBound = this.handleSubmit.bind(this);
	}

	public init(): void {
		this.submitButton = document.getElementById("logout");

		if (!this.submitButton) {
			console.error("Logout button not found!");
			return;
		}

		this.submitButton.addEventListener("click", this.handleSubmitBound);
	}

	private async handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			if (response.ok) {
				setUser(undefined);
				router.navigateTo("/game#login");
				logoutChannel.postMessage("logout");
				return;
			}

			let data = await response.json();

			if (!response.ok) {
				console.error(data.message);
				return;
			}

		} catch (err) {
			console.error(err);
		}
	}

	public destroy(): void {
		if (this.submitButton)
			this.submitButton.removeEventListener("click", this.handleSubmitBound)
	}
}
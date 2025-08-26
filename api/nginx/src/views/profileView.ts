import {Component} from "../route/component.js";
import {FriendService} from "../relationship/friendsService.js";
import {viewManager} from "./viewManager.js";

export class profileView implements Component {

	private container: HTMLElement;
	private readonly viewManager: viewManager;
	private readonly username: string | null;

	constructor(container: HTMLElement, viewManager: viewManager, username: string | null) {
		this.container = container
		this.viewManager = viewManager
		this.username = username
	}

	public async init(): Promise<void> {

		if (this.username === null) {
			console.log("Not found page")
			return;
		}

		const response = await fetch(`/api/users/${this.username}/id`);

		const data = await response.json()

		if (!response.ok) {
			console.log("Not found page")
			return;
		}

		await FriendService.viewProfile(data.id, this.viewManager);
	}

	public destroy() {
		FriendService.destroy();
	}
}
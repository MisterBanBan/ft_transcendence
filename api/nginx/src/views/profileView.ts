import {Component} from "../route/component.js";
import {FriendService} from "../relationship/friendsService.js";
import {viewManager} from "./viewManager.js";
import {router} from "../route/router.js";

export class profileView implements Component {

	private readonly viewManager: viewManager;
	private readonly username: string | null;

	constructor( viewManager: viewManager, username: string | null) {
		this.viewManager = viewManager
		this.username = username
	}

	public async init(): Promise<void> {

		if (this.username === null) {
			router.navigateTo("/game#notFound", this.viewManager)
			return;
		}

		const response = await fetch(`/api/users/${this.username}/id`);

		const data = await response.json()

		if (!response.ok) {
			router.navigateTo("/game#notFound", this.viewManager)
			return;
		}

		await FriendService.viewProfile(data.id, this.viewManager);
	}

	public destroy() {
		FriendService.destroy();
	}
}
import { Component } from "../component.js";
import { viewManager } from "./viewManager.js";
import { tournament } from "../menuInsert/Tournaments/tournament.js";
import {tournamentSocket, updateTournamentInfos} from "../tournaments.js";
import {createTournamentForm} from "../menuInsert/Tournaments/createTournamentForm.js";
import {showTournaments} from "../tournament/show-tournaments.js";

export class tournamentView implements Component{

	private container: HTMLElement;
	private viewManager: viewManager;

	constructor(container: HTMLElement, viewManager: viewManager) {
		this.container = container;
		this.viewManager = viewManager;
	}

	public init(): void {

		this.container.innerHTML = '';
		this.container.innerHTML = tournament();
		this.listTournament();
	}

	private listTournament() {

		const leftBox = document.getElementById('left-box');
		if (!leftBox) {
			console.error('Tournament page container not found');
			return;
		}

		leftBox.innerHTML = '';
		leftBox.insertAdjacentHTML('beforeend', createTournamentForm());

		const response = fetch('/api/tournament/getTournamentsList')
		response.then((data) => {
			data.json().then((json) => {
				if (json.event === "updateTournamentsList")
					showTournaments(tournamentSocket, json.data);
				else if (json.event === "updateTournamentInfos") {
					updateTournamentInfos(json.data)
				}
			})
		})

		const createTournamentSubmit = document.getElementById('create-tournament-submit');
		if (!createTournamentSubmit) {
			console.error('Create tournament button not found');
			return;
		}

		createTournamentSubmit.addEventListener('click', () => this.createTournament())
	}

	private createTournament() {
		const nameInput = document.getElementById("tournament-name") as HTMLInputElement | null;
		const sizeInput = document.getElementById("tournament-size") as HTMLInputElement | null;

		if (!nameInput || !sizeInput) {
			console.error("Error: one or multiple fields is missing");
			return;
		}

		const name = nameInput.value;
		const size = sizeInput.value;

		tournamentSocket.emit("create", name, parseInt(size));
	}

	public destroy(): void {
		this.container.innerHTML = '';
	}
}
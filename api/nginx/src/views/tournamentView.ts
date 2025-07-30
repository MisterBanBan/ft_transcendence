/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournamentView.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 16:24:16 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/30 11:13:53 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "../component.js";
import { viewManager } from "./viewManager.js";
import { tournament } from "../menuInsert/tournament.js";
import { tournamentList } from "../menuInsert/listingTournament.js";
import { tournamentPage8 } from "../menuInsert/tournamentPage8.js";
import { createTournamentForm } from "../menuInsert/createTournamentForm.js";
import { joinTournament } from "../menuInsert/joinTournament.js"
import {tournamentPage4} from "../menuInsert/tournamentPage4.js";
import {showTourmaments} from "../tournament/show-tourmaments.js";
import {leftTournamentInfos} from "../menuInsert/leftTournamentInfos.js";

export class tournamentView implements Component{

	private container: HTMLElement;
	private viewManager: viewManager;

	private readonly socket: any;

	constructor(container: HTMLElement, viewManager: viewManager, socket: any) {
		this.container = container;
		this.viewManager = viewManager;
		console.log("socket:", socket)
		this.socket = socket;
	}

	public init(): void {

		console.log("init");
		this.container.innerHTML = '';
		this.container.innerHTML = tournament();
		this.listTournament();
		this.attachEventListeners();
	}

	private attachEventListeners() {
		//document.getElementById('score')?.addEventListener('click', this.handleScore);
	}

	private listTournament() {
		const tournamentsListDiv = document.getElementById('right-box-infos');
		if (!tournamentsListDiv) {
			console.error('Tournament container not found');
			return;
		}
		const leftBox = document.getElementById('left-box');
		if (!leftBox) {
			console.error('Tournament page container not found');
			return;
		}

		tournamentsListDiv.innerHTML = '';

		leftBox.innerHTML = '';
		leftBox.insertAdjacentHTML('beforeend', createTournamentForm());

		// Leave tournament menu
		const tournamentButton = document.getElementById('return-button');
		if (!tournamentButton) {
			console.error('Tournament page container not found');
			return;
		}
		tournamentButton.addEventListener('click', () => {
			this.viewManager.show('game');
		});

		// See a tournament
		this.socket.on("updateTournamentsList", (tournamentsList: any) => {
			console.log(tournamentsList);
			type Tournament = { name: string, size: number, registered: number, players: Array<string> };
			tournamentsList.forEach(({name, size, registered, players}: Tournament) => {
				console.log(players);
				console.log(`Tournoi: ${name} | Taille: ${size} | Inscrits: ${registered} | Joueurs: ${players}`);
			});

			showTourmaments(this.socket, tournamentsList, tournamentsListDiv);
		})

		this.socket.on("updateTournamentInfos", (tournamentInfos: any) => {

			const infos = tournamentInfos as { name: string, size: number, registered: number, players: Array<string> }

			this.tournamentPage(tournamentInfos.size);

			const name = document.getElementById("tournament-title") as HTMLElement
			const playersList = document.getElementById("players-list") as HTMLUListElement
			if (!name || !playersList) {
				console.error("Missing elements to show tournament info");
				return;
			}

			name.innerText = infos.name

			for (let child of playersList.children) {
				const parts = child.id.split("-");
				if (parts.length >= 2) {
					const name = parts.slice(1, parts.length).join("-");
					if (!infos.players.includes(name)) {
						child.remove();
					}
				}
			}

			infos.players.forEach((name: string) => {
				const playerLi = document.getElementById(`player-${name}`);

				if (!playerLi) {
					const li = document.createElement("li");

					// TODO if owner text-yellow-400 responsive-text-players-list
					li.className = "responsive-text-players-list"
					li.innerText = `- ${name}`;
					li.id = `player-${name}`;

					playersList.appendChild(li);
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

	private tournamentPage(size: number) {

		const tournamentPageContainer = document.getElementById('right-box-infos');
		if (!tournamentPageContainer) {
			console.error('Tournament page container not found');
			return;
		}
		const leftBox = document.getElementById('left-box');
		if (!leftBox) {
			console.error('Tournament page container not found');
			return;
		}
		leftBox.innerHTML = '';
		leftBox.insertAdjacentHTML("beforeend", leftTournamentInfos());

		const fakeJoin = document.getElementById('fake-join-tournament');
		const start = document.getElementById('start-tournament');
		const leave = document.getElementById('leave-tournament');

		if (fakeJoin)
			fakeJoin.addEventListener("click", async (e) => {
				e.preventDefault()

				this.socket.emit("fakeJoin")
			})

		if (start)
			start.addEventListener("click", async (e) => {
				e.preventDefault()

				this.socket.emit("start")
			})

		if (leave)
			leave.addEventListener("click", async (e) => {
				e.preventDefault()

				this.listTournament()
				this.socket.emit("leave")

			})

		if (size == 4) {
			tournamentPageContainer.innerHTML = '';
			tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage4());
		} else {
			tournamentPageContainer.innerHTML = '';
			tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage8());
		}
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

		this.socket.emit("create", name, parseInt(size));
	}

	public destroy(): void {
		this.container.innerHTML = '';
	}
}
import { tournamentPage8 } from "../menuInsert/Tournaments/tournamentPage8.js";
import {tournamentPage4} from "../menuInsert/Tournaments/tournamentPage4.js";
import {showTournaments} from "./show-tournaments.js";
import {leftTournamentInfos} from "../menuInsert/Tournaments/leftTournamentInfos.js";
import {router} from "../route/router.js";
import {getUser} from "../route/user-handler.js";
import {tournamentInfoPopup} from "../menuInsert/Tournaments/tournamentInfoPopup.js";
import {wait} from "../route/wait.js";
import {ApiUtils} from "../relationship/apiUtils.js";

declare const io: any;

let tournamentSocket: any = null;
let connectionPromise: Promise<void> | null = null;

function handleStart(e: Event) {
	e.preventDefault()
	emitTournamentSocket("start");
}

function handleLeave(e: Event) {
	e.preventDefault()
	emitTournamentSocket("leave");
}

export async function initTournamentSocket() {
	if (tournamentSocket?.connected)
		return

	if (connectionPromise)
		return connectionPromise;

	connectionPromise = new Promise<void>((resolve) => {
		tournamentSocket = io(`/`, {
			transports: ["websocket", "polling"],
			withCredentials: true,
			path: "/wss/tournament"
		});

		tournamentSocket.on("connect", () => {
			resolve();
		});

		tournamentSocket.on("startingTournament", () => {
			const mainDiv = document.getElementById("dynamic-content")
			if (mainDiv) {
				mainDiv.insertAdjacentHTML("beforebegin", tournamentInfoPopup("Tournament starting in 00:10"));

				const countdown = document.getElementById("tournament-info-popup");

				if (countdown) {
					let duration = 9
					const timer = setInterval(async () => {

						countdown.textContent =
							`Tournament starting in 00:${duration.toString().padStart(2, '0')}`;

						if (--duration < 0) {
							clearInterval(timer);
							countdown.textContent = "Round starting";
							await wait(1000)
							countdown.remove()
						}
					}, 1000);
				}
			}
		})

		tournamentSocket.on("leftTournament", () => {
			router.navigateTo("/game#tournament");
		});

		tournamentSocket.on("updateTournamentsList", (tournamentsList: any) => {
			showTournaments(tournamentsList);
		});

		tournamentSocket.on("updateTournamentInfos", (tournamentInfos: any) => {
			updateTournamentInfos(tournamentInfos);
		});

		tournamentSocket.on("updateTimer", (tournamentName: string, timeLeft: string) => {
			const title = document.getElementById("tournament-title")
			if (title)
				title.textContent = `${tournamentName} (${timeLeft})`
		});

		tournamentSocket.on("newMatch", () => {
			router.navigateTo("/Pong?mode=private");
		});

		tournamentSocket.on("matchEnded", () => {
			router.navigateTo("/game#tournament");
		});

		tournamentSocket.on("roundEnded", async () => {
			const mainDiv = document.getElementById("dynamic-content")
			if (mainDiv) {
				mainDiv.insertAdjacentHTML("beforebegin", tournamentInfoPopup("Gathering results..."));

				await wait(2500)

				document.getElementById("tournament-info-popup")?.remove();

				mainDiv.insertAdjacentHTML("beforebegin", tournamentInfoPopup("Round starting in 00:05"));

				const countdown = document.getElementById("tournament-info-popup");

				if (countdown) {
					let duration = 4
					const timer = setInterval(async () => {

						countdown.textContent =
							`Round starting in 00:${duration.toString().padStart(2, '0')}`;

						if (--duration < 0) {
							clearInterval(timer);
							countdown.textContent = "Round starting";
							await wait(1000)
							countdown.remove()
						}
					}, 1000);
				}
			}
		})

		tournamentSocket.on("tournamentEnded", async (winner: string) => {
			const mainDiv = document.getElementById("dynamic-content")
			if (mainDiv) {
				mainDiv.insertAdjacentHTML("beforebegin", tournamentInfoPopup("And the winner is..."));

				await wait(2500)

				document.getElementById("tournament-info-popup")?.remove();
				mainDiv.insertAdjacentHTML("beforebegin", tournamentInfoPopup(`${winner} !`));

				await wait(5000);
			}

			router.navigateTo("/game");
		});

		tournamentSocket.on("error", (message: string) => {
			ApiUtils.showAlert(message)
		})
	});

	return connectionPromise;
}

export function clearTournamentSocket() {
	if (tournamentSocket) {
		tournamentSocket.disconnect()
		tournamentSocket = null
		connectionPromise = null;
	}
}

export function emitTournamentSocket(eventName: string, ...args: any[]) {
	if (tournamentSocket)
		tournamentSocket.emit(eventName, ...args)
}

interface Match {
	player1?: number;
	player2?: number;
	winner?: number;
}

interface TournamentStructure {
	rounds: Match[][];
	winner?: number;
}

function tournamentPage(size: number, ownerId: number, started: boolean) {

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

	const start = document.getElementById('start-tournament');
	if (start) start.removeEventListener("click", handleStart)
	const leave = document.getElementById('leave-tournament');
	if (leave) leave.removeEventListener("click", handleLeave)

	if (started) {
		if (start)
			start.remove()
	}
	else {
		if (start) {
			if (getUser()?.id !== ownerId) {
				start.remove();
			}
			else
				start.addEventListener("click", handleStart)
		}
	}

	if (leave)
		leave.addEventListener("click", handleLeave);

	if (size == 4) {
		tournamentPageContainer.innerHTML = '';
		tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage4());
	} else {
		tournamentPageContainer.innerHTML = '';
		tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage8());
	}
}

export function updateTournamentInfos(tournamentInfos: any) {

	const infos = tournamentInfos as {
		name: string,
		size: number,
		registered: number,
		ownerId: number,
		players: Array<[number, { name: string, state: string }]>,
		started: boolean
		structure: TournamentStructure
	}

	const map: Record<number, { name: string, state: string}> = Object.fromEntries(infos.players);

	tournamentPage(tournamentInfos.size, tournamentInfos.ownerId, infos.started);

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
			const splitName = parts.slice(1, parts.length).join("-");
			if (!infos.players.some(([id, { name, state }]) => name === splitName)) {
				child.remove();
			}
		}
	}

	const playersListTitle = document.getElementById("players-list-title")
	if (playersListTitle)
		playersListTitle.innerText = `Players (${infos.players.length}/${infos.size})`;

	infos.players.forEach(([id, { name, state }]) => {
		const playerLi = document.getElementById(`player-${name}`);

		if (!playerLi) {
			const li = document.createElement("li");

			if (infos.ownerId === id)
				li.className = "text-yellow-400 responsive-text-players-list"
			else
				li.className = "responsive-text-players-list"

			li.innerText = `- ${name}`;
			if (id === getUser()?.id)
				li.innerText += ' (You)';
			else if (id !== getUser()?.id && infos.started)
				li.innerText += ` (${state})`

			li.id = `player-${name}`;

			playersList.appendChild(li);
		}
		else {
			if (infos.ownerId === id)
				playerLi.className = "text-yellow-400 responsive-text-players-list"
			else
				playerLi.className = "responsive-text-players-list"
		}
	})

	if (infos.started) {
		infos.structure.rounds.forEach((round: Match[], i: number) => {
			const roundDiv = document.getElementById(`round-${i + 1}`);
			if (roundDiv) {
				round.forEach((match: Match, j: number) => {
					const matchDiv = roundDiv.querySelector(`#match-${j + 1}`)
					if (matchDiv) {
						const player1Div = matchDiv.querySelector('#player-1')
						const player2Div = matchDiv.querySelector('#player-2')

						if (player1Div) {
							if (match.player1)
								player1Div.textContent = map[match.player1].name
							else
								player1Div.textContent = "Undefined"
						}

						if (player2Div) {
							if (match.player2)
								player2Div.textContent = map[match.player2].name
							else
								player2Div.textContent = "Undefined"
						}
					}
				})
			}
		})
	}

	const winnerDiv = document.getElementById("winner")
	if (!winnerDiv) {
		console.error("Missing winner box");
		return;
	}

	if (infos.structure.winner)
		winnerDiv.innerText = map[infos.structure.winner].name
	else
		winnerDiv.innerText = "Undefined"
}
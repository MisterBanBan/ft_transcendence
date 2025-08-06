import { tournamentPage8 } from "./menuInsert/Tournaments/tournamentPage8.js";
import {tournamentPage4} from "./menuInsert/Tournaments/tournamentPage4.js";
import {showTournaments} from "./tournament/show-tournaments.js";
import {leftTournamentInfos} from "./menuInsert/Tournaments/leftTournamentInfos.js";
import {router} from "./router.js";
import {getUser} from "./user-handler.js";

declare const io: any;

let tournamentSocket: any;

export function initTournamentSocket() {
	if (tournamentSocket)
		return

	tournamentSocket = io(`/`, {
		transports: ["websocket", "polling"],
		withCredentials: true,
		path: "/wss/tournament"
	});

	tournamentSocket.on("connect", () => {
		console.log("Connected:", tournamentSocket.id)
	});

	tournamentSocket.on("updateTournamentsList", (tournamentsList: any) => {
		console.warn("updateTournamentsList")
		showTournaments(tournamentsList);
	})

	tournamentSocket.on("updateTournamentInfos", (tournamentInfos: any) => {
		console.warn("updateTournamentInfos")
		updateTournamentInfos(tournamentInfos)
	})

	tournamentSocket.on("newMatch", () => {
		console.log("New Match")
		router.navigateTo("/Pong?mode=private");
	})

	tournamentSocket.on("leftTournament", () =>{
		console.warn("Left tournament from another position");
		router.navigateTo("/game#tournament");
	})

	tournamentSocket.on("matchEnded", () =>{
		console.warn("Returning to tournament");
		router.navigateTo("/game#tournament");
	})

	tournamentSocket.on("tournamentEnded", () => {
		console.warn("Returning to game");
		router.navigateTo("/game");
	})
}

export function clearTournamentSocket() {
	if (tournamentSocket) {
		tournamentSocket.disconnect()
		tournamentSocket = null
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
	const fakeJoin = document.getElementById('fake-join-tournament');
	const leave = document.getElementById('leave-tournament');

	if (started) {
		if (start)
			start.remove()
		if (fakeJoin)
			fakeJoin.remove()
	}
	else {

		if (start) {
			if (getUser()?.id !== ownerId) {
				console.log("Start remove")
				start.remove();
			}
			else
				start.addEventListener("click", async (e) => {
					e.preventDefault()
					emitTournamentSocket("start");
					// tournamentSocket.emit("start")
				})
		}

		if (fakeJoin) {
			if (getUser()?.id !== ownerId) {
				console.log("Fake join remove")
				fakeJoin.remove();
			}
			else
				fakeJoin.addEventListener("click", async (e) => {
					e.preventDefault()
					emitTournamentSocket("fakeJoin")
					// tournamentSocket.emit("fakeJoin")
				})
		}
	}

	if (leave)
		leave.addEventListener("click", async (e) => {
			e.preventDefault()

			emitTournamentSocket("leave")
		})

	if (size == 4) {
		tournamentPageContainer.innerHTML = '';
		tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage4());
	} else {
		tournamentPageContainer.innerHTML = '';
		tournamentPageContainer.insertAdjacentHTML('beforeend', tournamentPage8());
	}
}

export function updateTournamentInfos(tournamentInfos: any) {
	console.warn("updateTournamentInfos");

	const infos = tournamentInfos as {
		name: string,
		size: number,
		registered: number,
		ownerId: number,
		players: Array<[number, string]>,
		started: boolean
		structure: TournamentStructure
	}

	const map: Record<number, string> = Object.fromEntries(infos.players);

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
			if (!infos.players.some(([id, name]) => name === splitName)) {
				child.remove();
			}
		}
	}

	infos.players.forEach(([id, name]) => {
		const playerLi = document.getElementById(`player-${name}`);

		if (!playerLi) {
			const li = document.createElement("li");

			if (infos.ownerId === id)
				li.className = "text-yellow-400 responsive-text-players-list"
			else
				li.className = "responsive-text-players-list"
			li.innerText = `- ${name}`;
			li.id = `player-${name}`;

			playersList.appendChild(li);
		}
	})

	if (infos.started) {
		infos.structure.rounds.forEach((round: Match[], i: number) => {
			const roundDiv = document.getElementById(`round-${i + 1}`);
			//console.log(`round-${i + 1}`)
			if (roundDiv) {
				round.forEach((match: Match, j: number) => {
					const matchDiv = roundDiv.querySelector(`#match-${j + 1}`)
					//console.log(`match-${j + 1}: `, matchDiv?.children);
					if (matchDiv) {
						const player1Div = matchDiv.querySelector('#player-1')
						const player2Div = matchDiv.querySelector('#player-2')

						if (player1Div) {
							//console.log("Player 1:", match.player1)
							if (match.player1)
								player1Div.textContent = map[match.player1]
							else
								player1Div.textContent = "Not defined"
						}

						if (player2Div) {
							//console.log("Player 2:", match.player2)
							if (match.player2)
								player2Div.textContent = map[match.player2]
							else
								player2Div.textContent = "Not defined"
						}
					}
				})
			}
			//console.log(`----------------------`)
		})
	}

	const winnerDiv = document.getElementById("winner")
	if (!winnerDiv) {
		console.error("Missing winner box");
		return;
	}

	if (infos.structure.winner)
		winnerDiv.innerText = map[infos.structure.winner]
	else
		winnerDiv.innerText = "Not defined"
}
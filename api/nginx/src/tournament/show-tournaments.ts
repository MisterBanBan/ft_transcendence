import {emitTournamentSocket} from "./tournamentsHandler.js";

export function showTournaments(tournamentsList: any) {

	const div = document.getElementById('right-box-infos');
	if (!div) {
		console.error('Tournaments list container not found');
		return;
	}

	const tournamentsNames: string[] = [];

	type Tournament = { name: string, size: number, registered: number };

	tournamentsList.forEach(({ name, size, registered }: Tournament, index: number) => {
		const tournamentDiv = document.getElementById(`tournament-${name}`);

		tournamentsNames.push(name);

		if (tournamentDiv) {
			const element = document.getElementById(`tournament-${name}-size`);
			if (element) {
				element.innerText = `${registered}/${size}`;
			}
		}
		else {
			const tournamentDiv = document.createElement("div");
			tournamentDiv.id = `tournament-${name}`;
			tournamentDiv.className = "flex flex-row justify-between items-center gap-4 responsive-text-historique "

			const h2 = document.createElement("h2");
			h2.className = "responsive-text-historique";
			h2.innerText = name;

			const h3 = document.createElement("h3");
			h3.id = `tournament-${name}-size`;
			h3.className = "responsive-text-historique";
			h3.innerText = `${registered}/${size}`;

			const button = document.createElement("button");
			button.type = "submit";
			button.id = `join-tournament-${name}`;
			button.className = 'responsive-placeholder placeholder-gray-600 responsive-case responsive-text'
			button.innerText = "Join";

			tournamentDiv.appendChild(h2);
			tournamentDiv.appendChild(h3);
			tournamentDiv.appendChild(button);

			div.appendChild(tournamentDiv);

			const joinTournament = document.getElementById(`join-tournament-${name}`)
			if (joinTournament)
				joinTournament.addEventListener("click", async (e) => {
					e.preventDefault();

					emitTournamentSocket("join", name);
				})
		}
	})

	for (let child of div.children) {
		const parts = child.id.split("-");
		if (parts.length >= 2) {
			const name = parts.slice(1, parts.length).join("-");
			if (!tournamentsNames.includes(name)) {
				child.remove();
			}
		}
	}
}
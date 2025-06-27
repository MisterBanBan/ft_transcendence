import {Component} from "../component";
import {wait} from "../wait.js";

export class GetTournaments implements Component {

	public init(): void {
		this.getTournaments().then(r => {});
	}

	destroy(): void {

	}

	private async getTournaments() {

		try {

			const div = document.getElementById("tournaments");

			if (!div) {
				console.error("Tournaments list not found");
				return;
			}


			while (1) {
				const response = await fetch("/api/tournament/getTournaments", {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					console.error(data.message);
					return;
				}

				const tournamentsNames: string[] = [];

				data.forEach((tournamentObj: { [key: string]: { size: number; players: number } }) => {

					const name = Object.keys(tournamentObj)[0];
					const details = tournamentObj[name];
					const tournamentDiv = document.getElementById(`tournament-${name}`);

					tournamentsNames.push(name);

					if (tournamentDiv) {
						const element = document.getElementById(`tournament-${name}-size`);
						if (element) {
							element.innerText = `${details.players}/${details.size}`;
						}
					}
					else {
						const tournamentDiv = document.createElement("div");
						tournamentDiv.id = `tournament-${name}`;
						tournamentDiv.className = "bg-white shadow-md w-full max-w-sm";

						const h2 = document.createElement("h2");
						h2.className = "text-2xl font-semibold mb-6 text-center";
						h2.innerText = name;

						const h3 = document.createElement("h3");
						h3.id = `tournament-${name}-size`;
						h3.className = "text-2xl text-gray-700 mb-4 text-center";
						h3.innerText = `${details.players}/${details.size}`;

						const input = document.createElement("input");
						input.id = "display-name";
						input.className = "block mx-auto mb-4 p-2 border";
						input.placeholder = "Votre pseudo";

						const button = document.createElement("button");
						button.type = "submit";
						button.id = `join-tournament-${name}`;
						button.className = "w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200";
						button.innerText = "Join";

						tournamentDiv.appendChild(h2);
						tournamentDiv.appendChild(h3);
						tournamentDiv.appendChild(input);
						tournamentDiv.appendChild(button);

						div.appendChild(tournamentDiv);

						console.log("Creating eventListener for", name);
						document.getElementById(`join-tournament-${name}`)!.addEventListener("click", async (e) => {
							e.preventDefault();

							console.log("clicked");

							const displayName = document.getElementById('display-name') as HTMLInputElement | undefined;
							if (!displayName) {
								console.error("Display name input not found");
								return;
							}

							const response = await fetch("/api/tournament/join", {
								method: "POST",
								headers: {"Content-Type": "application/json"},
								body: JSON.stringify({ name: name, displayName: displayName.value } as { name: string, displayName: string }),
							})

							const data = await response.json();

							if (!response.ok) {
								console.error(data.message);
								return;
							}
						})

						console.log(`Tournoi : ${name}`);
						console.log(`  - Taille : ${details.size}`);
						console.log(`  - Joueurs : ${details.players}`);
					}
				});

				for (let child of div.children) {
					const parts = child.id.split("-");
					if (parts.length >= 2) {
						const name = parts[1];
						if (!tournamentsNames.includes(name)) {
							child.remove();
						}
					}
				}
				await wait(10000);
			}

		} catch (error) {
			console.error(error);
		}
	}

}
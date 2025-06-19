import {Component} from "../component";

export class GetTournaments implements Component {

	public init(): void {
		this.getTournaments();
	}

	destroy(): void {

	}

	private async getTournaments() {

		try {
			const response = await fetch("/api/tournament/getTournaments", {
				method: "GET",
			});

			const data = await response.json();

			const div = document.getElementById("tournaments");

			if (!div) {
				console.error("Tournaments list not found");
				return;
			}

			data.forEach((tournamentObj: { [key: string]: { size: number; players: number } }) => {
				const name = Object.keys(tournamentObj)[0];
				const details = tournamentObj[name];

				div.innerHTML += `<div class="bg-white shadow-md w-full max-w-sm">
									<h2 class="text-2xl font-semibold mb-6 text-center">${name}</h2>
									<h3 class="text-2xl text-gray-700 mb-4 text-center">${details.players}/${details.size}</h3>
									<input>
									 <button type="submit" id="join-tournament-${name}"
									 class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">Join</button>
								</div>`

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
			});

			if (!response.ok) {
				console.error(data.message);
				return;
			}

			if (data.success) {
				return window.location.href = '/';
			}

		} catch (error) {
			console.error(error);
		}
	}

}
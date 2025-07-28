export function showTourmaments(socket: any, tournamentsList: any) {

	const div = document.getElementById("tournaments");

	if (!div) {
		console.error("Tournaments list not found");
		return;
	}

	const tournamentsNames: string[] = [];

	type Tournament = { name: string, size: number, registered: number, players: Array<string> };

	tournamentsList.forEach(({ name, size, registered, players }: Tournament) => {
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
			tournamentDiv.className = "bg-white shadow-md w-full max-w-sm";

			const h2 = document.createElement("h2");
			h2.className = "text-2xl font-semibold mb-6 text-center";
			h2.innerText = name;

			const h3 = document.createElement("h3");
			h3.id = `tournament-${name}-size`;
			h3.className = "text-2xl text-gray-700 mb-4 text-center";
			h3.innerText = `${registered}/${size}`;

			const button = document.createElement("button");
			button.type = "submit";
			button.id = `join-tournament-${name}`;
			button.className = "w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200";
			button.innerText = "Join";

			tournamentDiv.appendChild(h2);
			tournamentDiv.appendChild(h3);
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

				console.log("JOINING", name)

				socket.emit("joinTournament", name, displayName.value)

				// const payload = {
				// 	name: name,
				// 	displayName: displayName.value
				// } as { name: string, displayName: string };

				// socket.sendAction("joinTournament", payload);

				// const response = await fetch("/api/tournament/join", {
				// 	method: "POST",
				// 	headers: {"Content-Type": "application/json"},
				// 	body: JSON.stringify({ name: name, displayName: displayName.value } as { name: string, displayName: string }),
				// })
				//
				// const data = await response.json();
				//
				// if (!response.ok) {
				// 	console.error(data.message);
				// 	return;
				// }
			})
		}
	})

	for (let child of div.children) {
		const parts = child.id.split("-");
		if (parts.length >= 2) {
			const name = parts[1];
			if (!tournamentsNames.includes(name)) {
				child.remove();
			}
		}
	}
}
import {FastifyInstance, FastifyRequest} from "fastify";
import {Match, Tournament} from "../class/Tournament.js";

export const tournaments = new Map<string, Tournament>();

async function createMatchs(matchesNb: number): Promise<Match[]> {
	const matchs: Match[] = [];

	for (let i = 0; i < matchesNb; i++) {
		const match: Match = {
			player1: undefined,
			player2: undefined,
			winner: undefined,
		}

		matchs.push(match);
	}

	return matchs;
}

export default async function (server: FastifyInstance) {
	server.post('/api/tournament/createTournament', {
		schema: {
			body: {
				type: "object",
				required: ["name", "size"],
				properties: {
					name: { type: "string", minLength: 1 },
					size: { type: "number", minimum: 4 },
				},
				additionalProperties: false,
			},
			response: {
				200: {
					type: "object",
					properties: {},
					additionalProperties: false,
				},
			}
		}
	}, async (request: FastifyRequest, reply) => {

		const { name, size } = request.body as {
			name: string,
			size: number,
		};

		const currentUser = request.currentUser;
		if (!currentUser) {
			return reply.code(404).send({
				error: "Not Found",
				message: "User not found"
			});
		}

		if (!["4", "8", "16"].includes(size.toString())) {
			return reply.status(400).send({
				error: "Bad Request",
				message: "Tournament size must be 4, 8 or 16"
			});
		}

		if (tournaments.has(name)) {
			return reply.status(400).send({
				error: "Bad Request",
				message: `Tournament ${name} already exists`
			});
		}

		const tournament = new Tournament(name, currentUser.id, size);
		tournament.addPlayer(currentUser.id, "DISPLAY");

		for (let matchesNb = size / 2; matchesNb > 1; matchesNb /= 2) {
			tournament.getStructure().rounds[matchesNb.toString()] = await createMatchs(matchesNb);
		}
		tournament.getStructure().rounds["1"] = await createMatchs(1);

		console.log(tournament.getStructure());
		console.log(tournament.getStructure().rounds);

		tournaments.set(name, tournament);

		return reply.code(200).send({ tournament });
	});
}

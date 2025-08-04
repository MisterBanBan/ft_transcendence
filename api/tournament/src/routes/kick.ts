// import {FastifyInstance, FastifyRequest} from "fastify";
// import {leaveTournament} from "../utils/leaveTournament.js";
// import {tournaments} from "../server.js";
//
// export default async function (server: FastifyInstance) {
// 	server.delete('/api/tournament/:name/kick/:userId', {
// 		schema: {
// 			params: {
// 				type: 'object',
// 				required: ['name', 'userId'],
// 				properties: {
// 					name: { type: 'string', minLength: 1, maxLength: 16 },
// 					userId: { type: 'string', pattern: '^[0-9]+$' },
// 				},
// 			},
// 		}
// 	}, async (request: FastifyRequest, reply) => {
//
// 		const { name, userId } = request.params as {
// 			name: string,
// 			userId: string,
// 		};
//
// 		const currentUser = request.currentUser;
// 		if (!currentUser) {
// 			return reply.code(404).send({
// 				error: "Not Found",
// 				message: "User not found"
// 			});
// 		}
//
// 		const tournament = tournaments.get(name);
// 		if (!tournament) {
// 			return reply.status(404).send({
// 				error: "Not Found",
// 				message: `Tournament ${name} does not exist`
// 			});
// 		}
//
// 		if (!tournament.hasOwnership(currentUser.id)) {
// 			return reply.status(403).send({
// 				error: "Forbidden",
// 				message: `You are not the owner of this tournament`
// 			});
// 		}
//
// 		if (currentUser.id === Number(userId)) {
// 			return reply.status(403).send({
// 				error: "Forbidden",
// 				message: `You can't kick yourself`
// 			});
// 		}
//
// 		leaveTournament(Number(userId), tournament);
//
// 		return reply.code(200).send({ message: "Kicked player successfully" });
// 	});
// }

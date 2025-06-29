import {FastifyPluginAsync} from "fastify";

// const socketPlugin: FastifyPluginAsync = async (server) => {
// 	if (!server.io) {
// 		console.error("server.io is undefined");
// 		return;
// 	}
// 	console.log("socket plugin started");
// 	server.io.on('connection', (socket: Socket) => {
// 		console.log(`Received a connection to ${socket.id}`);
//
// 		socket.on('createTournament', () => {
// 			console.log("createTournament");
// 			socket.emit('createdTournament');
// 		})
//
// 		socket.on('disconnect', () => {
// 			console.log(`Disconnecting ${socket.id}`);
// 		})
// 	})
// }
//
// export default socketPlugin;
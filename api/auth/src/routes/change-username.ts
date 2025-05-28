import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance) {
	server.post('/api/auth/change-username', async (request, reply) => {
		console.log(request.cookies);
		return reply.send({});
	// 	const { username, password } = request.body as { username: string; password: string }
	//
	// 	if (!request.cookies && !request.cookies.token) {
	// 		return reply.code(401).redirect(`/auth`);
	// 	}
	//
	// 	if (!username || !password) {
	// 		return reply.code(400).send({ error: "New username and password are required" });
	// 	}
	//
	// 	const decoded = server.jwt.decode(request.cookies.token);
	});
}
import fastifyHttpProxy from "@fastify/http-proxy";
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance, opts: any) {

	server.register(fastifyHttpProxy, {
		upstream: 'https://users:8080/api/users/',
		prefix: '/api/users',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'https://tournament:8081/api/tournament/',
		prefix: '/api/tournament',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'https://game:8082/api/game/',
		prefix: '/api/game',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'https://matchmaking:8083/api/matchmaking/',
		prefix: '/api/matchmaking',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'https://auth:8084/api/auth/',
		prefix: '/api/auth',
	})

	// server.register(fastifyHttpProxy, {
	// 	upstream: 'wss://tournament:8081/',
	// 	prefix: '/wss/tournament',
	// 	websocket: true,
	// 	undici: {
	// 	  connect: {
	// 		rejectUnauthorized: false
	// 	  }
	// 	},
	// 	replyOptions: {
	// 	  rewriteRequestHeaders: (req, headers) => {
	// 		console.log('[Proxying]', req.url);
	// 		return headers;
	// 	  }
	// 	}
	//   });
}
import fastifyHttpProxy from "@fastify/http-proxy";
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance, opts: any) {

	server.register(fastifyHttpProxy, {
		upstream: 'http://users:8080/api/users/',
		prefix: '/api/users',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://tournament:8081/api/tournament/',
		prefix: '/api/tournament',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://game:8082/api/game/',
		prefix: '/api/game',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://matchmaking:8083/api/matchmaking/',
		prefix: '/api/matchmaking',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://auth:8084/api/auth/',
		prefix: '/api/auth',
	})
}
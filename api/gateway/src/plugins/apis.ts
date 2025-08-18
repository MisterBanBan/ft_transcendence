import fastifyHttpProxy from "@fastify/http-proxy";
import {FastifyInstance} from "fastify";

function validUser(encodedUser: string | string[] | undefined): boolean {
	if (Array.isArray(encodedUser)) {
		encodedUser = encodedUser[0];
	}

	if (encodedUser) {

		try {
			const decoded = JSON.parse(Buffer.from(encodedUser, 'base64').toString());

			if (!decoded || typeof decoded.id !== 'number'
				|| typeof decoded.username !== 'string'
				|| typeof decoded.provider !== 'string'
				|| ((typeof decoded.provider_id === 'object' && decoded.provider_id !== null ) && typeof decoded.provider_id !== 'string')
				|| typeof decoded.tfa !== 'boolean'
				|| typeof decoded.updatedAt !== 'number')
				return false;

			return true;

		} catch {
			return false;
		}
	}
	return false;
}

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
		upstream: 'http://ai:8085/api/ai/',
		prefix: '/api/ai',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://matchmaking:8083/api/matchmaking/',
		prefix: '/api/matchmaking',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://auth:8084/api/auth/',
		prefix: '/api/auth',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://users-status:8086/api/users-status/',
		prefix: '/api/users-status',
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://matchmaking:8083/wss/matchmaking',
		prefix: '/wss/matchmaking',
		websocket: true,
		wsClientOptions: {
			queryString(search, reqUrl, request) {
				const url = new URL(reqUrl, `http://${process.env.HOSTNAME}`);
				let encodedUser = request.headers['x-current-user'];
				if (encodedUser && validUser(encodedUser)) {
					if (Array.isArray(encodedUser)) encodedUser = encodedUser[0];
					url.searchParams.set('user', encodedUser);
				}
				return url.searchParams.toString();
			}
		}
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://tournament:8081/wss/tournament',
		prefix: '/wss/tournament',
		websocket: true,
		wsClientOptions: {
			queryString(search, reqUrl, request) {
				const url = new URL(reqUrl, `http://${process.env.HOSTNAME}`);
				let encodedUser = request.headers['x-current-user'];
				if (encodedUser && validUser(encodedUser)) {
					if (Array.isArray(encodedUser)) encodedUser = encodedUser[0];
					url.searchParams.set('user', encodedUser);
				}
				return url.searchParams.toString();
			}
		}
	})

	server.register(fastifyHttpProxy, {
		upstream: 'http://users-status:8086/wss/users-status',
		prefix: '/wss/users-status',
		websocket: true,
		wsClientOptions: {
			queryString(search, reqUrl, request) {
				const url = new URL(reqUrl, `http://${process.env.HOSTNAME}`);
				let encodedUser = request.headers['x-current-user'];
				if (encodedUser && validUser(encodedUser)) {
					if (Array.isArray(encodedUser)) encodedUser = encodedUser[0];
					url.searchParams.set('user', encodedUser);
				}
				return url.searchParams.toString();
			}
		}
	})
}
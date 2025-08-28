import fastifyCookies from "@fastify/cookie";
import fastifyJWT from "@fastify/jwt";
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance, opts: any) {
	if (!process.env.JWT_SECRET)
		throw new Error('JWT_SECRET environment variable is required');

	server.register(fastifyCookies, {
		secret: process.env.COOKIE_SECRET,
		hook: 'onRequest',
		parseOptions: {},
	});

	server.register(fastifyJWT, {
		secret: process.env.JWT_SECRET,
	});
};
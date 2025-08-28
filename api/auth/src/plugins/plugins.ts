import fastifyCookies from "@fastify/cookie";
import fastifyFormbody from "@fastify/formbody";
import fastifyJWT from "@fastify/jwt";
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance, opts: any) {
	if (!process.env.COOKIE_SECRET)
		throw new Error('COOKIE_SECRET environment variable required');
	if (!process.env.JWT_SECRET)
		throw new Error('JWT_SECRET environment variable is required');
	if (!process.env.ARGON_SECRET)
		throw new Error('ARGON_SECRET environment variable is required');
	if (!process.env.CLIENT_SECRET_42 || !process.env.CLIENT_ID_42)
		throw new Error('CLIENT 42 environment variables are required');
	if (!process.env.CLIENT_SECRET_GOOGLE || !process.env.CLIENT_ID_GOOGLE)
		throw new Error('CLIENT GOOGLE environment variables are required');

	server.register(fastifyCookies, {
		secret: process.env.COOKIE_SECRET,
		hook: 'onRequest',
		parseOptions: {},
	});

	server.register(fastifyFormbody);

	server.register(fastifyJWT, {
		secret: process.env.JWT_SECRET,
	});
};
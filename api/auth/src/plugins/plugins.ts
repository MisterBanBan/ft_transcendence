import fastifyStatic from "@fastify/static";
import path from "path";
import fastifyCookies from "@fastify/cookie";
import fastifyFormbody from "@fastify/formbody";
import fastifyJWT from "@fastify/jwt";
import {fileURLToPath} from "url";
import dotenv from "dotenv";
import {FastifyInstance} from "fastify";

export default async function (server: FastifyInstance, opts: any) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	dotenv.config({ path: path.join(__dirname, '../../.env') });

	if (!process.env.JWT_SECRET)
		throw new Error('JWT_SECRET environment variable is required');
	if (!process.env.ARGON_SECRET)
		throw new Error('ARGON_SECRET environment variable is required');
	if (!process.env.CLIENT_SECRET_42 || !process.env.CLIENT_ID_42)
		throw new Error('CLIENT 42 environment variables are required');

	server.register(fastifyStatic, {
		root: path.join(__dirname, '../dist'),
		prefix: '/public/',
	});

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
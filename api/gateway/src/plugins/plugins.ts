import path from "path";
import fastifyCookies from "@fastify/cookie";
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

	server.register(fastifyCookies, {
		secret: process.env.COOKIE_SECRET,
		hook: 'onRequest',
		parseOptions: {},
	});

	server.register(fastifyJWT, {
		secret: process.env.JWT_SECRET,
	});
};
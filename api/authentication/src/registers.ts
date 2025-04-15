import { server } from "./index.js";
import fastifyStatic from "@fastify/static";
import path from "path";
import fastifyCookies from "@fastify/cookie";
import fastifyFormbody from "@fastify/formbody";
import fastifyJWT from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import {fileURLToPath} from "url";
import dotenv from "dotenv";
import fs from "fs";

export async function loadModules() {

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	dotenv.config({ path: path.join(__dirname, '../.env') });

	const directoryPath = path.join(__dirname, '../');

	await import(path.join(__dirname, "sign-up.js"));

	if (!process.env.JWT_SECRET) {
		console.log("Reading folder", directoryPath);

		try {
			const files = await fs.promises.readdir(directoryPath);
			console.log('Contenu du dossier:', files);
		} catch (err) {
			console.error('Erreur lors de la lecture du dossier:', err);
		}

		throw new Error('JWT_SECRET environment variable is required');
	}

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

	server.register(fastifyCors, {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
		preflightContinue: false,
	});
}
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

async function start() {
	const dir = __dirname;

	const app = fastify();

	await app.register(fastifyIO, {
		path: "/wss/users-status",
	});

	app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
	app.register(autoLoad, { dir: join(dir, "routes/") });

	try {
		const db: Database = await open({
			filename: '/app/database/users/users_db.sqlite',
			driver: sqlite3.Database
		});
		app.decorate('db', db);
	} catch (err) {
		console.error("Database connection error:", err);
		throw err;
	}

	app.listen({ port: 8086, host: "0.0.0.0" }, (err) => {
		if (err) {
			process.exit(1);
		}
	});
	console.log(`Users-status service is running on 0.0.0.0:8086`);
}

start();

import {FastifyInstance} from "fastify";
import sqlite3 from 'sqlite3';
import {Database, open} from 'sqlite'
import {Umzug, JSONStorage} from 'umzug';
import fs from 'fs';

export default async function (server: FastifyInstance, opts: any) {
	fs.access('/app/database', fs.constants.W_OK, (err) => {
		if (err) {
			console.error("/app/database access failed", err);
		} else {
			console.log("/app/database is written!");
		}
	});

	let db: Database;
	try {
		db = await open({ filename: "./database/auth/auth_db.sqlite", driver: sqlite3.Database });

		const usersDb: Database = await open({
			filename: "/app/database/users/users_db.sqlite",
			driver: sqlite3.Database,
		});

		server.decorate("usersDb", usersDb);

		console.log("database connected.");
	} catch (err) {
		console.error("Database error :", err);
		throw err;
	}

	const umzug = new Umzug({
		logger: undefined,
		create: {},
		migrations: { glob: 'dist/migrations/*.js' },
		context: db,
		storage: new JSONStorage({ path: "./database/auth/migrations.json" })
	});
	await umzug.up();
	server.decorate('db', db);
};
import { FastifyInstance } from "fastify";
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export default async function(server: FastifyInstance) {
	const authDb: Database = await open({
		filename: "/app/database/auth/auth_db.sqlite",
		driver: sqlite3.Database,
	});

	const usersDb: Database = await open({
		filename: "/app/database/users/users_db.sqlite",
		driver: sqlite3.Database,
	});

	server.decorate('authDb', authDb);
	server.decorate('usersDb', usersDb);
}
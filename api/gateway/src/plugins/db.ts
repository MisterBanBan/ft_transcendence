import { FastifyInstance } from "fastify";
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export default async function(server: FastifyInstance) {
	const db: Database = await open({
		filename: "/app/database/auth_db.sqlite",
		driver: sqlite3.Database,
	});
	server.decorate('db', db);
}
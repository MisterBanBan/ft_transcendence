import type { Database } from 'sqlite';

export async function up({ context }: { context: Database }) {
	await context.run(`
		CREATE TABLE IF NOT EXISTS auth (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL,
			password TEXT,
			tfa TEXT,
			provider TEXT NOT NULL DEFAULT 'local',
			provider_id TEXT,
			updatedAt INTEGER NOT NULL
		)
	`);
}

export async function down({ context }: { context: Database }) {
	await context.run('DROP TABLE IF EXISTS auth');
}
import type { Database } from 'sqlite';

export async function up({ context }: { context: Database }) {
    await context.run(`
        CREATE TABLE IF NOT EXISTS history (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             winner_score INTEGER,
             loser_score INTEGER,
             winner VARCHAR(255) NOT NULL,
             loser VARCHAR(255) NOT NULL, 
             created_at INTEGER NOT NULL
        )
    `);
}

export async function down({ context }: { context: Database }) {
    await context.run('DROP TABLE IF EXISTS history');
}
import type { Database } from 'sqlite';

export async function up({ context }: { context: Database }) {
    await context.run(`
        CREATE TABLE IF NOT EXISTS matchmaking (
            match_id INTEGER NOT NULL,
            user_id  INTEGER NOT NULL,
            score    INTEGER DEFAULT 0,
            outcome  TEXT CHECK (outcome IN ('winner', 'loser', 'draw')) DEFAULT NULL,
            PRIMARY KEY (match_id, user_id)
        )
    `);
}

export async function down({ context }: { context: Database }) {
    await context.run('DROP TABLE IF EXISTS matchmaking');
}
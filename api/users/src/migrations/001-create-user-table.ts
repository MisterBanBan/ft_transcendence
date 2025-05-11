import type { Database } from 'sqlite';

export async function up({ context }: { context: Database }) {
    await context.run(`
        CREATE TABLE IF NOT EXISTS users (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             username TEXT UNIQUE NOT NULL,
             password TEXT NOT NULL,
             avatar_url TEXT
        );
    `);
    await context.run(`
        CREATE TABLE IF NOT EXISTS relationships (
            requester_id INTEGER NOT NULL,
            addressee_id INTEGER NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'blocked')),
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (requester_id) REFERENCES users(id),
            FOREIGN KEY (addressee_id) REFERENCES users(id),
            PRIMARY KEY (requester_id, addressee_id)
        );
    `)
}

export async function down({ context }: { context: Database }) {
    await context.run('DROP TABLE IF EXISTS users');
    await context.run('DROP TABLE IF EXISTS relationships');
}
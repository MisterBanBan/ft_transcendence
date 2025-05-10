import type { Database } from 'sqlite';

export async function up({ context }: { context: Database }) {
    await context.run(`
        CREATE TABLE IF NOT EXISTS users (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             username TEXT UNIQUE NOT NULL,
             password TEXT NOT NULL
        )
    `);
    await context.run(`
        CREATE TABLE IF NOT EXISTS friends (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL
        )
    `);
    await context.run(`
        CREATE TABLE IF NOT EXISTS blocked_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL
        )
    `);
}

export async function down({ context }: { context: Database }) {
    await context.run('DROP TABLE IF EXISTS users');
    await context.run('DROP TABLE IF EXISTS friends');
    await context.run('DROP TABLE IF EXISTS blocked_users');
}
import type { Database } from 'sqlite';

export async function up({ context }: { context: Database }) {
    await context.run(`
        CREATE TABLE IF NOT EXISTS tournaments (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            status     TEXT CHECK (status IN ('pending', 'ongoing', 'completed')) DEFAULT 'pending',
            start_date DATETIME,
            end_date   DATETIME
        )
    `);

    await context.run(`
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tournament_id INTEGER NOT NULL,
            status TEXT CHECK(status IN ('scheduled', 'in_progress', 'completed')) DEFAULT 'scheduled',
            stage TEXT CHECK(stage IN ('quarterfinal', 'semifinal', 'final')) NOT NULL
--             FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
        )
    `);

    await context.run(`
        CREATE TABLE IF NOT EXISTS match_players (
            match_id INTEGER NOT NULL,
            user_id  INTEGER NOT NULL,
            score    INTEGER DEFAULT 0,
            outcome  TEXT CHECK (outcome IN ('winner', 'loser', 'draw')) DEFAULT NULL,
            PRIMARY KEY (match_id, user_id)
--             FOREIGN KEY (match_id) REFERENCES matches (id),
--             FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    await context.run(`
        CREATE TABLE IF NOT EXISTS user_tournament_registration (
            tournament_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (tournament_id, user_id)
--             FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
--             FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
}

export async function down({ context }: { context: Database }) {
    await context.run('DROP TABLE IF EXISTS match_players');
    await context.run('DROP TABLE IF EXISTS user_tournament_registration');
    await context.run('DROP TABLE IF EXISTS matches');
    await context.run('DROP TABLE IF EXISTS tournaments');
}
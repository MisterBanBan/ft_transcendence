import type { Database } from 'sqlite';

export async function up({ context }: { context: Database }) {
    await context.run(`
        CREATE TABLE IF NOT EXISTS users (
             id TEXT PRIMARY KEY,
             username TEXT UNIQUE NOT NULL,
             avatar_url TEXT DEFAULT 'last_airbender.jpg',
             status TEXT DEFAULT 'offline' CHECK(status IN ('offline', 'online', 'in_game')),
             last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await context.run(`
        CREATE TABLE IF NOT EXISTS relationships (
            requester_id INTEGER NOT NULL,
            addressee_id INTEGER NOT NULL,
            status_r TEXT NOT NULL CHECK(status_r IN ('pending', 'accepted')),
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (requester_id) REFERENCES users(id),
            FOREIGN KEY (addressee_id) REFERENCES users(id),
            PRIMARY KEY (requester_id, addressee_id)
        );
    `);

    await context.run(`
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player1_id TEXT NOT NULL,
            player2_id TEXT NOT NULL,
            winner_id TEXT,
            player1_score INTEGER DEFAULT 0,
            player2_score INTEGER DEFAULT 0,
            game_type TEXT DEFAULT 'online' CHECK(game_type IN ('online', 'tournament')),
            completed_at DATETIME,
            FOREIGN KEY (player1_id) REFERENCES users(id),
            FOREIGN KEY (player2_id) REFERENCES users(id),
            FOREIGN KEY (winner_id) REFERENCES users(id)
        );
    `);

    await context.run(`
        CREATE TABLE IF NOT EXISTS user_stats (
            user_id TEXT PRIMARY KEY,
            total_games INTEGER DEFAULT 0 NOT NULL,
            wins INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);

    await context.run(`
        CREATE INDEX IF NOT EXISTS idx_matches_player1 ON matches(player1_id);
        CREATE INDEX IF NOT EXISTS idx_matches_player2 ON matches(player2_id);
        CREATE INDEX IF NOT EXISTS idx_matches_winner ON matches(winner_id);
        CREATE INDEX IF NOT EXISTS idx_matches_completed_at ON matches(completed_at);
    `);

    await context.run(`
        CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
        CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);
    `);
}

export async function down({ context }: { context: Database }) {
    await context.run('DROP TABLE IF EXISTS users');
    await context.run('DROP TABLE IF EXISTS relationships');
    await context.run('DROP TABLE IF EXISTS matches');
    await context.run('DROP TABLE IF EXISTS user_stats');
}
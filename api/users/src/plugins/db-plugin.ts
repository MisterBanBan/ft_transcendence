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
        db = await open({ filename: "./database/users/users_db.sqlite", driver: sqlite3.Database });
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
        storage: new JSONStorage({ path: "./database/users/migrations.json" })
    });
    try {
        await umzug.up();
    } catch (error) {
        console.log(error);
    }

    const usersTableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    const relationshipsTableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='relationships'");

// Verify if both tables exist and provide appropriate feedback
    if (usersTableExists && relationshipsTableExists) {
        console.log("Both 'users' and 'relationships' tables were successfully created");
    } else if (usersTableExists) {
        console.error("The 'users' table exists, but the 'relationships' table was not created properly");
    } else if (relationshipsTableExists) {
        console.error("The 'relationships' table exists, but the 'users' table was not created properly");
    } else {
        console.error("None of the tables were created properly");
    }

    server.decorate('db', db);
};
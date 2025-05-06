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
        db = await open({ filename: "./database/authentication_db.sqlite", driver: sqlite3.Database });
        console.log("Connexion à la base SQLite réussie ou base créée.");
    } catch (err) {
        console.error("Erreur lors de la création ou connexion à la base SQLite :", err);
        throw err;
    }

    const umzug = new Umzug({
        logger: undefined,
        create: {},
        migrations: { glob: 'dist/migrations/*.js' },
        context: db,
        storage: new JSONStorage({ path: "./database/migrations.json" })
    });
    await umzug.up();
    server.decorate('db', db);
};
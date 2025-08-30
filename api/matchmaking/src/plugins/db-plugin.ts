import {FastifyInstance} from "fastify";
import sqlite3 from 'sqlite3';
import {Database, open} from 'sqlite'

export default async function (server: FastifyInstance, opts: any) {
    
    try {

        const userDb: Database = await open({
            filename: "/app/database/users/users_db.sqlite",
            driver: sqlite3.Database,
        });
        server.decorate('userDb', userDb);

        console.log("database connected.");
    } catch (err) {
        console.error("Database error :", err);
        throw err;
    }
};
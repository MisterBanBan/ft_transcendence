import {Database} from "sqlite";

export async function createDefaultUser(db: Database) {
    const existingUser = await db.get("SELECT * FROM users WHERE username = 'sans'");

    if (!existingUser) {
        const defaultPassword = "1234";

        await db.run(`
            INSERT INTO users (username, password, avatar_url) 
            VALUES ('sans', ?, 'fleur.jpeg')
        `, defaultPassword);

        console.log("Default user 'sans' created successfully");
    } else {
        console.log("Default user 'sans' already exists");
    }
}

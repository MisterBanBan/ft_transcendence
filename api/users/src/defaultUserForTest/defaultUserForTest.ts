import {Database} from "sqlite";

export async function createDefaultUser(db: Database) {
    // Check if default user already exists to avoid duplicates
    const existingUser = await db.get("SELECT * FROM users WHERE username = 'sans'");

    if (!existingUser) {
        // Generate a secure hashed password
        const defaultPassword = "1234";

        // Insert default user into the database
        await db.run(`
            INSERT INTO users (username, password, avatar_url) 
            VALUES ('sans', ?, 'https://cdn.intra.42.fr/users/default.png')
        `, defaultPassword);

        console.log("Default user 'sans' created successfully");
    } else {
        console.log("Default user 'sans' already exists");
    }
}

import { FastifyInstance } from "fastify";

export async function updateUserStatus(app: FastifyInstance, userId: string, newStatus: string) {
	try {
		const result = await app.db.run(
    		`UPDATE users SET status = ? WHERE id = ?`,
    		newStatus,
    		userId
		);
	} catch (error) {
		console.error('Erreur lors de la mise à jour du status:', error);
	}
}
import { FastifyInstance } from "fastify";
import { pipeline } from 'stream/promises';
import fs from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

export default async function (server: FastifyInstance) {
    server.post('/api/users/:id/avatar', {
        // Ajout de la validation des paramètres
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', pattern: '^\\d+$' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id;
            console.log(`Tentative d'upload pour l'utilisateur ${userId}`);

            // Vérification de l'existence du répertoire uploads
            const uploadDir = './uploads';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const data = await request.file();

            if (!data) {
                console.error('Aucun fichier reçu');
                return reply.code(400).send({ error: 'No file provided' });
            }

            if (data.file.truncated) {
                console.error('Fichier trop volumineux');
                return reply.code(413).send({ error: 'File size exceeds limit' });
            }

            // Validation de l'extension
            const extension = path.extname(data.filename).toLowerCase();
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

            if (!allowedExtensions.includes(extension)) {
                console.error('Extension non autorisée:', extension);
                return reply.code(415).send({ error: 'Unsupported file type' });
            }

            // Génération du nom de fichier
            const newFilename = `${randomUUID()}${extension}`;
            const uploadPath = path.join(uploadDir, newFilename);

            // Écriture du fichier
            await pipeline(
                data.file,
                fs.createWriteStream(uploadPath)
            );

            // Mise à jour de la base de données
            const result = await server.db.run(
                'UPDATE users SET avatar_url = ? WHERE id = ?',
                [newFilename, userId]
            );

            if (result.changes === 0) {
                console.error('Utilisateur non trouvé:', userId);
                return reply.code(404).send({ error: 'User not found' });
            }

            console.log('Avatar mis à jour avec succès pour', userId);
            return {
                avatarUrl: `/uploads/${newFilename}`,
                message: 'Avatar updated successfully'
            };

        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            return reply.code(500).send({
                error: 'Internal server error',
            });
        }
    });
}

import { ApiClient } from '../api.js';

export class AvatarUploadComponent {
    constructor(private apiClient: ApiClient) {}

    async uploadAvatar(userId: string, fileInput: HTMLInputElement): Promise<void> {
        const resultDiv = document.getElementById('upload-result');
        if (!resultDiv) return;

        if (!fileInput.files || fileInput.files.length === 0) {
            resultDiv.innerHTML = '<div class="error">Please select a file</div>';
            return;
        }

        const file = fileInput.files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            resultDiv.innerHTML = '<div class="error">Please select an image file</div>';
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            resultDiv.innerHTML = '<div class="error">File size must be less than 5MB</div>';
            return;
        }

        try {
            resultDiv.innerHTML = '<div class="loading">Uploading...</div>';

            const result = await this.apiClient.uploadAvatar(userId, file);

            resultDiv.innerHTML = `
                <div class="success">
                    <p>${result.message}</p>
                    <img src="${result.avatarUrl}" alt="Avatar" class="avatar-preview">
                </div>
            `;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            resultDiv.innerHTML = '<div class="error">Failed to upload avatar</div>';
        }
    }
}

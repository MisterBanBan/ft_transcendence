import { setAvatarUrl } from '../../route/user-handler.js';
import {ApiUtils} from "../../relationship/apiUtils.js";


export class ProfilePictureManager {
    private pictureElement: HTMLButtonElement | null = null;
    private fileInput!: HTMLInputElement;
    private isInitialized: boolean = false;

    constructor() {
        this.createFileInput();
    }

    public init(): void {
        if (this.isInitialized) return;

        this.pictureElement = document.getElementById('picture-profile') as HTMLButtonElement;

        if (!this.pictureElement) {
            console.warn('Picture element not found, will retry later');
            return;
        }
        

        this.pictureElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.fileInput.click();
        });

        this.isInitialized = true;
    }

    public reinitialize(): void {
        this.isInitialized = false;
        this.init();
    }

    private createFileInput(): void {
        const existingInput = document.getElementById('profile-file-input');
        if (existingInput) {
            existingInput.remove();
        }

        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.id = 'profile-file-input';
        this.fileInput.accept = 'image/jpeg,image/jpg,image/png,image/webp';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);

        this.fileInput.addEventListener('change', (event) => {
            this.handleFileSelection(event);
        });
    }

    private async handleFileSelection(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            ApiUtils.showAlert('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            ApiUtils.showAlert('File size must be less than 5MB')
            return;
        }

        this.showLoadingState();

        try {
            await this.uploadProfilePicture(file);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            this.hideLoadingState();
            this.fileInput.value = '';
        }
    }

    private async uploadProfilePicture(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/users/avatar`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();

        this.updateProfilePicture(result.avatarName, result.avatarUrl);
    }

    private updateProfilePicture(avatarName: string, avatarUrl: string): void {
        if (!this.pictureElement) return;

        if (typeof avatarUrl !== 'string') {
            console.error('Avatar URL is not a string:', avatarUrl);
            return;
        }
        setAvatarUrl(avatarName)
        const uniqueUrl = `${avatarUrl}?t=${Date.now()}`;

        this.pictureElement.style.backgroundImage = `url('${uniqueUrl}')`;
        this.pictureElement.style.backgroundSize = '100% 100%';
        this.pictureElement.style.backgroundRepeat = 'no-repeat';
        this.pictureElement.style.backgroundPosition = 'center';
    }

    private showLoadingState(): void {
        if (!this.pictureElement) return;

        this.pictureElement.style.opacity = '0.6';
        this.pictureElement.style.cursor = 'wait';
        this.pictureElement.innerHTML = '<div class="loading-spinner"></div>';
    }

    private hideLoadingState(): void {
        if (!this.pictureElement) return;

        this.pictureElement.style.opacity = '1';
        this.pictureElement.style.cursor = 'pointer';
        this.pictureElement.innerHTML = '';
    }

    public destroy(): void {
        if (this.fileInput && this.fileInput.parentNode) {
            this.fileInput.parentNode.removeChild(this.fileInput);
        }
        this.isInitialized = false;
    }
}

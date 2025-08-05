import { getUser, setAvatarUrl } from '../../user-handler.js';

interface UserWithAvatar {
    avatar_url?: string | { avatar_url: string };
    id?: string | number;
}

export class ProfilePictureManager {
    private pictureElement: HTMLButtonElement | null = null;
    private fileInput!: HTMLInputElement;
    private userId: string;
    private isInitialized: boolean = false;

    constructor(userId: string) {
        this.userId = userId;
        this.createFileInput();
    }

    public init(): void {
        if (this.isInitialized) return;

        this.pictureElement = document.getElementById('picture-profile') as HTMLButtonElement;

        if (!this.pictureElement) {
            console.warn('Picture element not found, will retry later');
            return;
        }

        this.loadCurrentProfilePicture();

        this.pictureElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.fileInput.click();
        });

        this.isInitialized = true;
        console.log('ProfilePictureManager initialized');
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

    private async loadCurrentProfilePicture(): Promise<void> {
        try {
            const currentUser = getUser() as UserWithAvatar;

            if (currentUser && currentUser.avatar_url) {
                let avatarUrl: string;

                if (typeof currentUser.avatar_url === 'object' && currentUser.avatar_url.avatar_url) {
                    avatarUrl = currentUser.avatar_url.avatar_url;
                }
                else if (typeof currentUser.avatar_url === 'string') {
                    avatarUrl = currentUser.avatar_url;
                }
                else {
                    console.warn('Invalid avatar_url format');
                    return;
                }

                const fullAvatarPath = avatarUrl.startsWith('/') ? avatarUrl : `/uploads/${avatarUrl}`;
                this.updateProfilePicture(fullAvatarPath);
            }
        } catch (error) {
            console.error('Error loading profile picture:', error);
        }
    }

    private async handleFileSelection(event: Event): Promise<void> {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            return;
        }

        this.showLoadingState();

        try {
            await this.uploadProfilePicture(file);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload profile picture. Please try again.');
        } finally {
            this.hideLoadingState();
            this.fileInput.value = '';
        }
    }

    private async uploadProfilePicture(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/users/${this.userId}/avatar`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();

        this.updateProfilePicture(result.avatarUrl);

        console.log('Profile picture updated successfully');
    }

    private updateProfilePicture(avatarUrl: string): void {
        if (!this.pictureElement) return;

        console.log('Updating profile picture with URL:', avatarUrl);
        console.log('URL type:', typeof avatarUrl);

        if (typeof avatarUrl !== 'string') {
            console.error('Avatar URL is not a string:', avatarUrl);
            return;
        }
        setAvatarUrl(avatarUrl);
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
        console.log('ProfilePictureManager destroyed');
    }
}

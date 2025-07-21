export class ApiUtils {
    static getApiUrl(): string {
        const urlElement = document.getElementById('apiUrl') as HTMLInputElement;
        return urlElement?.value || 'https://localhost:8443/';
    }

    static getCurrentUserId(): string {
        const userIdElement = document.getElementById('currentUserId') as HTMLInputElement;
        return userIdElement?.value || 'user1';
    }

    static showAlert(message: string): void {
        alert(message);
    }

    static showConfirm(message: string): boolean {
        return confirm(message);
    }
}

export class ApiUtils {
    static getApiUrl(): string {
        const urlElement = document.getElementById('apiUrl') as HTMLInputElement;
        return urlElement?.value || 'https://localhost:8443/';
    }

    static getCurrentUserId(): string {
        const userIdElement = document.getElementById('currentUserId') as HTMLInputElement;
        return userIdElement?.value || 'user1';
    }

    static displayResponse(containerId: string, response: any, isError: boolean = false): void {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.textContent = JSON.stringify(response, null, 2);
        container.className = `response ${isError ? 'error' : 'success'}`;
    }

    static clearResponse(containerId: string): void {
        const container = document.getElementById(containerId);
        if (container) {
            container.textContent = '';
            container.className = 'response';
        }
    }

    static showAlert(message: string): void {
        alert(message);
    }

    static showConfirm(message: string): boolean {
        return confirm(message);
    }
}

export class ApiUtils {
    static getCurrentUserId(): string {
        const userIdElement = document.getElementById('currentUserId') as HTMLInputElement;
        return userIdElement?.value;
    }

    static showAlert(message: string): void {
        alert(message);
    }
}

export class ApiConfig {
    private static readonly BASE_URL = 'http://localhost:8443';

    static getApiUrl(endpoint: string): string {
        return `${this.BASE_URL}${endpoint}`;
    }

    static getDefaultHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
}

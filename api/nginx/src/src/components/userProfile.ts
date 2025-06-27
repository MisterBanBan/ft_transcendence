import { ApiClient } from '../api.js';

export class UserProfileComponent {
    constructor(private apiClient: ApiClient) {}

    async loadProfile(userId: string): Promise<void> {
        try {
            const profile = await this.apiClient.getUserProfile(userId);
            this.displayProfile(profile);
        } catch (error) {
            console.error('Error loading profile:', error);
            this.displayError('Failed to load profile');
        }
    }

    private displayProfile(profileData: any): void {
        const profileDisplay = document.getElementById('profile-display');
        if (!profileDisplay) return;

        const { user, stats, matches } = profileData.data;

        profileDisplay.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <h3>${user.username || `User ${user.id}`}</h3>
                    <span class="user-status ${user.status}">${user.status}</span>
                </div>
                
                <div class="profile-stats">
                    <h4>Statistics</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Total Games:</span>
                            <span class="stat-value">${stats.total_games}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Wins:</span>
                            <span class="stat-value">${stats.wins}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Losses:</span>
                            <span class="stat-value">${stats.losses}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Win Rate:</span>
                            <span class="stat-value">${stats.win_rate}%</span>
                        </div>
                    </div>
                </div>

                <div class="profile-matches">
                    <h4>Recent Matches</h4>
                    <div class="matches-list">
                        ${matches.map((match: any) => `
                            <div class="match-item">
                                <div class="match-info">
                                    <span class="opponent">vs ${match.opponent_username}</span>
                                    <span class="result ${match.result.toLowerCase()}">${match.result}</span>
                                </div>
                                <div class="match-score">
                                    ${match.player1_score} - ${match.player2_score}
                                </div>
                                <div class="match-date">
                                    ${new Date(match.completed_at).toLocaleDateString()}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    private displayError(message: string): void {
        const profileDisplay = document.getElementById('profile-display');
        if (profileDisplay) {
            profileDisplay.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

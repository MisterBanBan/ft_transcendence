import { ApiUtils } from './apiUtils.js';

export class InvitationService {
    private static readonly BASE_URL = 'https://localhost:8443';

    static async sendInvitation(): Promise<void> {
        const currentUserId = ApiUtils.getCurrentUserId();
        const addresseeElement = document.getElementById('inviteUserId') as HTMLInputElement;
        const addresseeId = addresseeElement?.value;

        if (!addresseeId) {
            ApiUtils.showAlert('Please enter a user ID to invite');
            return;
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/${currentUserId}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': currentUserId
                },
                body: JSON.stringify({
                    addressee_id: addresseeId
                })
            });

            const data = await response.json();
            ApiUtils.displayResponse('inviteResponse', data, !response.ok);
        } catch (error) {
            ApiUtils.displayResponse('inviteResponse', { error: (error as Error).message }, true);
        }
    }

    static async loadInvitations(): Promise<void> {
        const currentUserId = ApiUtils.getCurrentUserId();

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/${currentUserId}/invitations`, {
                headers: {
                    'user-id': currentUserId
                }
            });

            const data = await response.json();
            ApiUtils.displayResponse('invitationsResponse', data, !response.ok);

            this.displayInvitations(data.invitations || []);
        } catch (error) {
            ApiUtils.displayResponse('invitationsResponse', { error: (error as Error).message }, true);
        }
    }

    static async acceptInvitation(): Promise<void> {
        const requesterElement = document.getElementById('requesterIdAccept') as HTMLInputElement;
        const requesterId = requesterElement?.value;

        if (!requesterId) {
            ApiUtils.showAlert('Please enter the requester ID');
            return;
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/${requesterId}/accept`, {
                method: 'PUT',
                headers: {
                    'user-id': ApiUtils.getCurrentUserId()
                }
            });

            const data = await response.json();
        } catch (error) {
        console.error(error);
    }
    }

    static async declineInvitation(): Promise<void> {
        const requesterElement = document.getElementById('requesterIdAccept') as HTMLInputElement;
        const requesterId = requesterElement?.value;

        if (!requesterId) {
            ApiUtils.showAlert('Please enter the requester ID');
            return;
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/${requesterId}/decline`, {
                method: 'DELETE',
                headers: {
                    'user-id': ApiUtils.getCurrentUserId()
                }
            });

            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    private static displayInvitations(invitations: any[]): void {
        const invitationsList = document.getElementById('invitationsList');
        if (!invitationsList) return;

        if (invitations.length > 0) {
            invitationsList.innerHTML = invitations.map(inv => `
                <div class="invitation-item pending">
                    <strong>${inv.username}</strong> (${inv.requester_id})
                    <br>Status: ${inv.status}
                    <br>Avatar: ${inv.avatar_url || 'N/A'}
                </div>
            `).join('');
        } else {
            invitationsList.innerHTML = '<p class="text-gray-400">Aucune invitation en attente</p>';
        }
    }
}

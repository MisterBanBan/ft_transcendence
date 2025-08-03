import { ApiUtils } from './apiUtils.js';
import {getUser} from "../user-handler.js";

interface InvitationRequest {
    addressee_username: string;
}

interface InvitationResponse {
    message?: string;
    error?: string;
    invitations?: Invitation[];
}

interface Invitation {
    requester_id: string;
    username: string;
    status: 'pending' | 'accepted' | 'declined';
    avatar_url?: string;
}

interface LoadInvitationResponse {
    message?: string;
    error?: string;
    invitations?: LoadInvitation[];
}

interface LoadInvitation {
    requester_id: string;
    username: string;
    avatar_url: string;
}

export class InvitationService {
    private static readonly BASE_URL = 'https://localhost:8443';

    static async sendInvitation(): Promise<void> {
        const currentUser = getUser();
        if (!currentUser) {
            ApiUtils.showAlert('User not authenticated');
            return;
        }

        const addresseeElement = document.getElementById('inviteUserId') as HTMLInputElement;
        const addresseeUsername = addresseeElement?.value?.trim();

        if (!addresseeUsername) {
            ApiUtils.showAlert('Please enter a user username to invite');
            return;
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/${currentUser.id}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    addressee_username: addresseeUsername
                } as InvitationRequest)
            });

            const data: InvitationResponse = await response.json();

            if (response.ok) {
                addresseeElement.value = '';
                ApiUtils.showAlert(data.message || 'Invitation sent successfully');
            } else {
                ApiUtils.showAlert(data.error || 'Failed to send invitation');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            ApiUtils.showAlert('Error sending invitation');
        }
    }

    static async loadInvitations(): Promise<void> {
        const currentUser = getUser();
        if (!currentUser) {
            ApiUtils.showAlert('User not authenticated');
            return;
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/${currentUser.id}/invitations`);

            if (!response.ok) {
                return;
            }

            const data: LoadInvitationResponse = await response.json();

            if (data.invitations && data.invitations.length > 0) {
                this.displayInvitations(data.invitations);
            } else {
                console.log('No pending invitations found');
            }
        } catch (error) {
            console.error('Error loading invitations:', error);
            ApiUtils.showAlert('Error loading invitations');
        }
    }

    static async acceptInvitation(requesterId?: string): Promise<boolean> {
        const currentUser = getUser();
        if (!currentUser) {
            ApiUtils.showAlert('User not authenticated');
            return false;
        }

        if (!requesterId) {
            ApiUtils.showAlert('Requester ID missing');
            return false;
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/invitations/${requesterId}/accept`, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorData = await response.json();
                ApiUtils.showAlert(errorData.error || `Failed to accept invitation: ${response.status}`);
                return false;
            }

            const data: InvitationResponse = await response.json();

            ApiUtils.showAlert(data.message || 'Invitation accepted successfully');
            await this.loadInvitations();
            return true;

        } catch (error) {
            console.error('Error accepting invitation:', error);
            ApiUtils.showAlert('Network error: Unable to accept invitation');
            return false;
        }
    }


    static async declineInvitation(requesterId?: string): Promise<boolean> {
        const currentUser = getUser();
        if (!currentUser) {
            ApiUtils.showAlert('User not authenticated');
            return false;
        }

        if (!requesterId) {
            ApiUtils.showAlert('Requester ID missing');
            return false;
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/users/invitations/${requesterId}/decline`, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorData = await response.json();
                ApiUtils.showAlert(errorData.error || `Failed to decline invitation: ${response.status}`);
                return false;
            }

            const data: InvitationResponse = await response.json();

            ApiUtils.showAlert(data.message || 'Invitation declined successfully');
            await this.loadInvitations();
            return true;

        } catch (error) {
            console.error('Error on refusal of invitation:', error);
            ApiUtils.showAlert('Network error: Unable to decline invitation');
            return false;
        }
    }

    private static displayInvitations(invitations: LoadInvitation[]): void {
        const invitationsList = document.getElementById('dynamic-popup');
        if (!invitationsList) return;

        if (invitations.length > 0) {
            invitationsList.innerHTML = `
            <div class="h-full w-full overflow-y-auto flex flex-col items-center justify-center">
                ${invitations.map(inv => `
                    <div class="flex flex-row items-center justify-between responsive-text-historique">
                        <div class="flex flex-row items-center gap-4">
                            <img src="${inv.avatar_url || '/img/default-avatar.png'}" alt="${this.escapeHtml(inv.username)}" class="w-10 h-10 rounded-full object-contain"/>
                            <span class="responsive-text-historique text-white font-medium">
                            ${this.escapeHtml(inv.username)}
                        </span>
                        </div>
                    </div>
                    <div class="flex flex-row justify-center gap-8 responsive-text-historique">
                        <button onclick="InvitationService.declineInvitation('${this.escapeHtml(inv.requester_id)}')" class="responsive-text-historique text-red-600">REJECT</button>
                        <button onclick="InvitationService.acceptInvitation('${this.escapeHtml(inv.requester_id)}')" class="responsive-text-historique text-green-600">ACCEPT</button>
                    </div>
                `).join('')}
            </div>
        `;
        } else {
            invitationsList.innerHTML = '<p class="text-gray-400">Aucune invitation en attente</p>';
        }
    }

    // for XSS
    private static escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

(window as any).InvitationService = InvitationService;
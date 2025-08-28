import { ApiUtils } from './apiUtils.js';
import {getUser} from "../route/user-handler.js";
import { InvitationRequest, InvitationResponse, LoadInvitationResponse, LoadInvitation } from "./types/invitation.js"

export class InvitationService {

    static async sendInvitation(): Promise<void> {
        const currentUser = getUser();
        if (!currentUser) {
            return;
        }

        const addresseeElement = document.getElementById('inviteUserId') as HTMLInputElement;
        if (!addresseeElement) {
            console.error('Invite user input element not found');
            return;
        }
        const addresseeUsername = addresseeElement?.value?.trim();

        if (!addresseeUsername) {
            return;
        }

        try {
            const response = await fetch(`/api/users/invite`, {
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
            } else {
                ApiUtils.showAlert(data.error as string);
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
        }
    }

    static async loadInvitations(): Promise<void> {
        const currentUser = getUser();
        if (!currentUser) {
            return;
        }

        try {
            const response = await fetch(`/api/users/invitations`);

            if (!response.ok) {
                return;
            }

            const data: LoadInvitationResponse = await response.json();

            if (data.invitations && data.invitations.length > 0) {
                this.displayInvitations(data.invitations);
            } else {
                this.displayInvitations([]);
            }
        } catch (error) {
            console.error('Error loading invitations:', error);
        }
    }

    static async acceptInvitation(requesterId?: string): Promise<boolean> {
        const currentUser = getUser();
        if (!currentUser) {
            return false;
        }

        if (!requesterId) {
            return false;
        }

        try {
            const response = await fetch(`/api/users/invitations/${requesterId}/accept`, {
                method: 'PUT',
            });

            if (!response.ok) {
                return false;
            }

            await this.loadInvitations();
            return true;

        } catch (error) {
            console.error('Error accepting invitation:', error);
            return false;
        }
    }


    static async declineInvitation(requesterId?: string): Promise<boolean> {
        const currentUser = getUser();
        if (!currentUser) {
            return false;
        }

        if (!requesterId) {
            return false;
        }

        try {
            const response = await fetch(`/api/users/invitations/${requesterId}/decline`, {
                method: 'PUT',
            });

            if (!response.ok) {
                return false;
            }

            await this.loadInvitations();
            return true;

        } catch (error) {
            console.error('Error on refusal of invitation:', error);
            return false;
        }
    }

    private static displayInvitations(invitations: LoadInvitation[]): void {
        const invitationsList = document.getElementById('dynamic-popup');
        if (!invitationsList) return;

        if (invitations.length > 0) {
            invitationsList.innerHTML = `
                <div class="h-full w-full overflow-y-auto flex flex-col mb-10 gap-4">
                    ${invitations.map(inv => `
                        <div class="flex flex-row ">
                             
                                <div class="flex flex-row gap-20">
                                    <div class="w-[40px] h-[40px] rounded-full overflow-hidden">
                                        <img src="/uploads/${inv.avatar_url || '/img/default-avatar.png'}" alt="${this.escapeHtml(inv.username)}" class="w-full h-full object-cover"/>
                                    </div>
                                    <span class="responsive-text-historique text-white font-medium ">
                                        ${this.escapeHtml(inv.username)}
                                    </span>
                                </div>

                            <div class="flex flex-row w-[80%] h-[20%] gap-8 responsive-text-historique justify-end">
                                <button class="responsive-text-historique text-red-600" data-requester-id="${this.escapeHtml(inv.requester_id)}" data-action="reject">REJECT</button>
                                <button class="responsive-text-historique text-green-600" data-requester-id="${this.escapeHtml(inv.requester_id)}" data-action="accept">ACCEPT</button>
                            </div>
                        </div>
                        
                    `).join('')}
                </div>
            </div>
        `;
        invitationsList.querySelectorAll('button[data-action="reject"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const requesterId = (e.target as HTMLElement).getAttribute('data-requester-id');
                if (requesterId) {
                    this.declineInvitation(requesterId);
                }
            });
        });

        invitationsList.querySelectorAll('button[data-action="accept"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const requesterId = (e.target as HTMLElement).getAttribute('data-requester-id');
                if (requesterId) {
                    this.acceptInvitation(requesterId);
                }
            });
        });
        } else {
            invitationsList.innerHTML = '<p class="text-gray-400 flex flex-row justify-center item-center gap-8">No pending invitations</p>';
        }
    }

    private static escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static destroy(): void {
        const invitationsList = document.getElementById('dynamic-popup');
        if (invitationsList) {
            invitationsList.querySelectorAll('button[data-action="reject"], button[data-action="accept"]').forEach(button => {
                const clone = button.cloneNode(true);
                button.replaceWith(clone);
            });
        }
    }
}
interface UserProfile {
	username: string;
	status: 'online' | 'offline' | 'in_game';
	totalGames?: number;
	wins?: number;
	losses?: number;
	winrate?: string;
}

interface Match {
	player1: string;
	player2: string;
	score1: number;
	score2: number;
	date: string;
	gameType?: string;
}

export const profile = (userProfile: UserProfile, matchHistory: Match[]): string => `
    <div id="profil" class="h-full w-full flex items-center justify-center">
    <div class="h-[85%] w-[90%] flex flex-col items-center justify-center bg-black/60">
        <div class="flex flex-row items-center justify-center  h-full w-full">
            <div id="infos" class="flex flex-col items-center justify-center h-full w-[70%] responsive-text">
                <div id="first" class="flex flex-row items-center justify-center h-[15%] w-[70%]">
                    <div class="flex flex-col items-center justify-center w-full h-full">
                        <p class="text-white">${userProfile.username}</p>
                         <span class="w-4 h-4 rounded-full border-2 mt-1 border-white ${userProfile.status === 'online' ? 'bg-green-500' : userProfile.status === 'in_game' ? 'bg-yellow-500' : 'bg-gray-400'}"></span>
                    </div>
                </div>
                <div id="second" class="flex flex-row items-center justify-between h-[25%] w-[70%] responsive-text">
                    <div class="flex flex-col  h-full">
                        <p class="responsive-text-profile">Total Game</p>
                        <p class="text-white">${userProfile.totalGames || 0}</p>
                    </div>
                    <div class="flex flex-col items-center  h-full ">
                        <p class="responsive-text-profile">Wins</p>
                        <p class="text-white">${userProfile.wins || 0}</p>
                    </div>
                    <div class="flex flex-col items-center  h-full ">
                        <p class="responsive-text-profile">Losses</p>
                        <p class="text-white">${userProfile.losses || 0}</p>
                    </div>
                    <div class="flex flex-col items-end  h-full ">
                        <p class="responsive-text-profile">Winrate</p>
                        <p class="text-white">${userProfile.winrate || '0%'}</p>
                    </div>
                </div>
                <div class="w-[70%] h-[35%] flex flex-col">
                    
                        <div class="h-[10%] w-full flex flex-row mb-8 justify-between items-center">
                            <p class="responsive-text-profile">Player1</p>
                            <p class="responsive-text-profile">Player2</p>
                            <p class="responsive-text-profile">Score</p>
                            <p class="responsive-text-profile">Game Type</p>
                            <p class="responsive-text-profile">Date</p>
                        </div>
                       <div id="dynamic-popup" class="h-full w-full overflow-y-auto">
                            ${matchHistory.slice(0, 10).map((match: Match) => `
                            <div class="flex flex-row responsive-text-historique items-center justify-between">
                                <button class="profile-btn flex-shrink-0 flex-grow-0 w-[20%] truncate text-left">${match.player1}</button>
                                <button class="profile-btn flex-shrink-0 flex-grow-0 w-[15%] truncate text-center">${match.player2}</button>
                                <span class="flex-shrink-0 flex-grow-0 w-[25%] truncate text-center">${match.score1} - ${match.score2}</span>
                                <span class="flex-shrink-0 flex-grow-0 w-[25%] truncate text-center">${match.gameType}</span>
                                <span class="flex-shrink-0 flex-grow-0 w-[15%] truncate text-center">${match.date}</span>
                            </div>
                            `).join('')}
                        </div>

                </div>
                <div class="w-[70%] h-[10%] items-center justify-center flex flex-col">
                    <button type="button" id="profileReturnBtn" class="text-white responsive-text-parametre ">Return</button>
                </div>
            </div>

        </div>
        </div>
    </div>
`;

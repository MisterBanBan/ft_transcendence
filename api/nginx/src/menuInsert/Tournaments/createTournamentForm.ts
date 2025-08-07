export const createTournamentForm = () => `
        <input type="text" id="tournament-name" placeholder="Name of the tournament"            
                class="responsive-case-register responsive-placeholder placeholder-gray-600 responsive-case responsive-text"/>  
                <select id="tournament-size" class="mt-4 mb-4 bg-black text-white border border-gray-500 rounded">
                        <option value="4">4 players</option>
                        <option value="8">8 players</option>
                    </select>
                <button id="create-tournament-submit" class="text-white responsive-text" >Create Tournament</button>
                <button id="leave-tournament-menu" class="text-white responsive-text" >Go back</button>
`
export const createTournament = () => `
        <input type="text" id="nameTournament" placeholder="Name of the tournament"            
                class="responsive-case-register responsive-placeholder responsive-case responsive-text"/>  
                <select id="tournamentDropdown" class="mt-4 mb-4 bg-black text-white border border-gray-500 rounded">
                        <option value="1">4 players</option>
                        <option value="2">8 players</option>
                    </select>
                <button id="submitCreatTournament" class="text-white responsive-text" >Creat Tournament</button>
`
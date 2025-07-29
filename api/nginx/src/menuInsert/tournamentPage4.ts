export const tournamentPage = () => `
    <div class="h-full w-full overflow-y-auto ">
        <div id="tournamentList" class="flex flex-row items-center justify-center h-full w-full">
            <div id="player1" class="flex flex-col items-center justify-center h-full w-full gap-2">    
                <div id="player1" class="flex flex-col items-center justify-center h-[30%] w-full">
                    <p class="flex flex-col">Player1</p>
                    <p class="flex flex-col">Player2</p>
                </div>
                
                <div id="player2" class="flex flex-col items-center justify-center h-[30%] w-full">
                    <p class="flex flex-col">Player1</p>
                    <p class="flex flex-col">Player2</p>
                </div>
            </div>
            <div id="player3" class="flex flex-col items-center justify-center h-full w-full gap-8">
                <img src="/img/barTournament.png" alt="tournament" class="w-[30%] h-[20%] rounded-full object-cover"/>
                <img src="/img/barTournament.png" alt="tournament" class="w-[30%] h-[20%] rounded-full object-cover"/>
            </div>
            <div id="finall" class="flex flex-col items-center justify-center h-full w-full">
                <div id="final" class="flex flex-col items-center justify-center h-full w-[40%] gap-10">
                    <p class="flex flex-col">Player1</p>
                    <p class="flex flex-col">Player2</p>
                </div>
            </div>
            <div id="player4" class="flex flex-col items-center justify-center h-full w-full">
                <img src="/img/barTournament.png" alt="tournament" class="w-[30%] h-[30%] rounded-full object-cover"/>

            </div>
            <div id="finalll" class="flex flex-col items-center justify-center h-full w-full">
                <div id="final" class="flex flex-col items-center justify-center h-full w-[40%]">
                    <p class="flex flex-col">Player1</p>
                </div>
            </div>
        </div>
    
    </div>
`
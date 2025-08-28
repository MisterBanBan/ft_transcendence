export interface Route {
	path: string;
	title: string;
	template: (() => Promise<string>) | string;
}

export const routes: Route[] = [
    {
        path: "/",
        title: "Accueil",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
            <div class="fixed inset-0 h-full w-full relative overflow-hidden">
                <div id="pageContainer" class="flex w-[300vw] h-screen overflow-hidden">
					<div
					id="procedural-bg"
					class="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
					>
				  
					</div>
				
					<div id="pageOne" class="w-screen h-screen relative bg-black/50">
						<div class="absolute left-0 bottom-0 w-full h-full z-10">
							<div class="relative top-0 left-[30%] w-[40%] h-[18%] object-contain">
								<img id="text" src="/img/text.png" class="w-full h-full"/>
								<div
									id="dialogueBox"
									class="absolute inset-0 flex items-center justify-center text-center px-4 break-words text-white font-omori text-2xl w-full h-full"
								>
								</div>
							</div>

							<img id="infoUser" src="/img/infoUser.png" class="absolute top-[40%] left-[38%]  w-[20%] h-[18%] object-cover pointer-events-none translate-y-2"/>
							<img src="/img/path2.png" class="absolute left-0 bottom-0 w-full h-[18%] object-cover pointer-events-none translate-y-2"/>
			
							<img src="/img/path.png"  class="absolute left-0 bottom-0 w-full h-[12%] object-cover pointer-events-none translate-y-2"/>

						</div>        
					</div>
					<div id="secondWindow" class="w-screen h-screen relative">
						<div class="absolute left-0 bottom-0 w-full h-full z-10">
							<img src="/img/path2.png" class="absolute left-0 bottom-0 w-full h-[18%] object-cover pointer-events-none translate-y-2"/>
		
							<img src="/img/path.png"  class="absolute left-0 bottom-0 w-full h-[12%] object-cover pointer-events-none translate-y-2"/>
						</div>      
					</div>

                  	<div id="trigger" class="w-screen h-screen relative z-50">
                    	<img src="/img/chalet.png" class="absolute bottom-[2%] left-0 w-[60%] h-[60%] object-contain"/>
						 <div id="pressE" class="absolute hidden inset-0 z-[999] flex items-center justify-center">
							<img src="/img/enter.png" class="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-24 h-24"/>
						</div>
						<div class="absolute left-0 bottom-0 w-full h-full z-10">
							<img src="/img/path2.png" class="absolute left-0 bottom-0 w-full h-[18%] object-cover pointer-events-none translate-y-2"/>
	
							<img src="/img/path.png"  class="absolute left-0 bottom-0 w-full h-[12%] object-cover pointer-events-none translate-y-2"/>
						</div>  
                  	</div>
				      
                </div>
			</div>
			<div id="skip" class="fixed h-[10%] right-0 bottom-0 w-[10%] item-center justify-center text-omori text-white">
				<button id="skipButton" class="w-full h-full object-contain">
				<img src="/img/skip.png" class="w-full h-full "/>
				</button>
			</div>
			<div id="player"
				class="fixed left-0 w-[10vw] h-[25vh] bg-[url('/img/kodama_stop1.png')] bg-contain bg-no-repeat z-10">
			</div>
              
`;
            

            
        }        
        
    },
    { 
        path: "/game",
        title: "Game",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
            <section id="sec_video" class="w-screen h-screen relative overflow-hidden flex items-center justify-center">
              <video autoplay loop muted id="video_main"
                class="block max-w-full max-h-full object-contain">
                <source src="/img/acceuil.mp4" type="video/mp4">
              </video>

             
              	<div id="container_form" class=" w-full h-full flex items-center justify-center pointer-events-auto ">
					<div class="flex flex-col items-center justify-center h-full w-[85%] relative">	    
						<button type="button" id="user" class="absolute flex items-center justify-center top-[10%] right-[5%] w-[6%] h-[10%] bg-[url('/img/profile.png')] bg-contain bg-no-repeat bg-center z-20 pointer-events-auto transition-transform duration-200 hover:scale-125">
								</button>
						<div id="dynamic-content" class="h-full w-full flex items-center justify-center absolute"></div>
					</div>
					<div id="picture" class="h-full w-[20%] flex justify-center relative">
					</div>
													
					
            	</div>
            </section>
            `;
        }
    },
	{
		path: "/chalet",
		title: "Chalet",
		template: async () => {
			await new Promise(resolve => setTimeout(resolve, 300));
			return `
				<div id="chalet" class="fixed inset-0 h-full w-full overflow-hidden">
					<div id="pageContainer" class="flex w-[200vw] h-full overflow-x-auto items-center justify-center relative">
						<img src="/img/chalet_inside.png" class="inset-0 w-full h-[75%] object-fill z-50">

					</div>
				<div class="absolute top-0 left-[30%] w-[40%] h-[18%] z-30">
						<img id="text" src="/img/text.png" alt="texte" class="w-full h-full object-contain" />
						<div
							id="dialogueBox"
							class="absolute inset-0 flex items-center justify-center text-center px-4 break-words text-white font-omori text-2xl"
						>
						</div>
				</div>
				
				<div id="pressE"
					class="hidden absolute inset-0 z-20 bg-black bg-opacity-50">
							<img src="/img/back.png" id="img" class="absolute top-[30%] w-28 h-28 -translate-x-1/2 -translate-y-1/2"/>
					
				</div>
				<div id="playerChalet"
				class="fixed left-0 w-[30vw] h-[60vh] bg-[url('/img/kodama_stop1.png')] bg-contain bg-no-repeat z-50">
			</div>
			`;
		}	
	},
    {

      path: "/Pong",
      title: "Pong",
      template: async () => {
        await new Promise(r => setTimeout(r, 300));
        return `
          <div id="pong" class="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
            <img
                id="pong-bg"
                src="/img/pong.png"
                alt="Pong background"
                class="block max-w-full max-h-full object-contain"
            />
            <img id="ball"  src="/img/ball.png"  class="absolute" />
            <img id="left-bar"  src="/img/bar_left.png"  class="absolute" />
            <img id="right-bar" src="/img/bar_left.png" class="absolute" />
 
    		<p id="score-player1"  class="absolute text-white/80 text-[calc(20vw)] font-omori z-0 opacity-70 drop-shadow">0</p>
   			<p id="score-player2" class="absolute text-white/80 text-[calc(20vw)] font-omori z-0 opacity-70 drop-shadow">0</p>

			<p id="timer" class="absolute text-white/80 text-[calc(20vw)] font-omori z-0 opacity-70 drop-shadow">0</p>

			<button id="backPong" class="absolute p-0 border-none bg-transparent">
				<img src="/img/backPong.png" class="hover:scale-110 transition-transform duration-300"/>
			</button>
			<button id="quitPong" class="absolute p-0 border-none bg-transparent">
				<img src="/img/quitGame.png" class="hover:scale-110 transition-transform duration-300"/>
			</button>

			<video autoplay loop muted id="loading" class="absolute object-contain">
				<source src="/img/loading.mp4" type="video/mp4">
			</video>

			<img id="win"  src="/img/youWin.png"  class="absolute" />
			<img id="lose"  src="/img/youLoose.png"  class="absolute" />

			<p id="end"  class="absolute text-white text-[calc(20vw)] font-omori z-0 drop-shadow"></p>
			<video autoplay loop muted id="video_main"
                class="absolute translate-y-2">
                <source src="/img/tuto.mp4" type="video/mp4">
            </video>
		</div>
				

        `;
      }
    },
    {
        path: "*",
        title: "404 - Page not found",
        template: `
			<div class="h-full w-full items-center justify-center" >
				<img src="/img/page404.png" class="w-screen h-screen object-cover"/>
			</div>
            `
    }
];


declare const io: any;

const socket = io("https://10.13.6.2:8083", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

let gameId: string | null = null;
let playerId: string | null = null;

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);
});

socket.on("game-started", (data: any) => {
  gameId = data.gameId;
  playerId = data.playerId;
  console.log("Game started! Game ID:", gameId, "Player ID:", playerId);
});

socket.on("game-update", (data: any) => {
  console.log("Game Update:", data);
});

socket.on("connect_error", (err: any) => {
  console.error("Connection error:", err);
});

// Fonction pour envoyer un input de test
function sendTestPlayerInput() {
  if (!gameId || !playerId) {
    console.warn("Game not started yet");
    return;
  }

  const input = {
    direction: "left",
    timestamp: Date.now(),
  };

  socket.emit("player-input", input);
  console.log("Sent input:", input);
}

window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("send-input-btn");
  if (btn) {
    btn.addEventListener("click", sendTestPlayerInput);
  }
});

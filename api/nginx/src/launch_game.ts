declare const io: any;

const socket = io("https://10.13.6.2:8083", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);
  socket.emit("message", "Hello from client");
});

socket.on("message", (msg: string) => {
  console.log("Received:", msg);
});

socket.on("game-update", (data: any) => {
  console.log("game:", data);
});

socket.on("connect_error", (err: any) => {
  console.error("Connection error:", err);
});

// Fonction qui envoie un player-input de test
function sendTestPlayerInput() {
  const testInput = {
    action: "test-move",
    timestamp: Date.now(),
    playerId: socket.id
  };
  socket.emit("player-input", testInput);
  console.log("Sent test player-input:", testInput);
}

// Attacher l'événement click après le chargement de la page
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("send-input-btn");
  if (btn) {
    btn.addEventListener("click", sendTestPlayerInput);
  }
});

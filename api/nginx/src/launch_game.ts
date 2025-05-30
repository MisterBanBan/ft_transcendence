declare const io: any;

const socket = io("https://10.13.4.1:8083", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

let gameId: string | null = null;
let playerId: string | null = null;

let ball = { x: 0, y: 0 };

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

function draw() {
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  requestAnimationFrame(draw);
}

let score_player1 = 0;
let score_player2 = 0;

function updateScore(newScore_player1: number, newScore_player2: number) {
	score_player1 = newScore_player1;
	score_player2 = newScore_player2;

	const scoreElement_player1 = document.getElementById("score-player1");
	if (scoreElement_player1) {
		scoreElement_player1.textContent = score_player1.toString();
	}

	const scoreElement_player2 = document.getElementById("score-player2");
	if (scoreElement_player2) {
		scoreElement_player2.textContent = score_player2.toString();
	}
}

draw();

socket.on("connect", () => {
  console.log("Connected with id:", socket.id);
});

socket.on("game-started", (data: any) => {
  gameId = data.gameId;
  playerId = data.playerId;
  console.log("Game started! Game ID:", gameId, "Player ID:", playerId);
});

socket.on("game-update", (data: { gameId: string, state: {
	players: { id: string, x: number }[],
	ball: { x: number, y: number, vx: number, vy: number },
	score: {player1: number, player2: number}}}) => {
	if (data && data.state && data.state.ball) {
    	ball = data.state.ball;
	if (data && data.state && data.state.score)
		updateScore(data.state.score.player1, data.state.score.player2);
	console.log("Game Update - Ball:", ball);
	}
});

socket.on("connect_error", (err: any) => {
  console.error("Connection error:", err);
});

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

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

socket.on("connect_error", (err: any) => {
  console.error("Connection error:", err);
});

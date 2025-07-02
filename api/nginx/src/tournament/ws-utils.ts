export function sendMessage(ws: WebSocket, action: string, infos: object | null) {
    ws.send(JSON.stringify({
        "action": action,
        "infos": infos,
    }));
}
export default class EnhancedSocket extends WebSocket {
    public sendAction(action: string, infos: object | null) {
        this.send(JSON.stringify({
            "action": action,
            "infos": infos,
        }));
    }
}
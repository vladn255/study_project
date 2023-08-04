const URL = 'ws://localhost:8000';

let socket;

addEventListener('message', (e) => {
    if (e.data.command === 'start') {
        socket = new WebSocket(URL);
        socket.addEventListener('message', (e) => {
            postMessage({ type: 'message', payload: e.data})
        })
    }

    if (e.data.command === 'stop') {
        if (socket) {
            socket.close();
        }
    }
});

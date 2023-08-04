const { createServer } = require("http");
const { WebSocketServer } = require("ws");

const MOCK_DATA = [
    'First test string',
    'Second test string',
    'Third test string',
    'Fourth test string',
    'Fifth test string'
]

const wss = new WebSocketServer({port: 8000})

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log('message received', data)
    });
    ws.on('disconnect', () => {
        alert('socket disconnected')
    });
    ws.on('error', (err) => {
        console.error('Something went wrong', err)
    })

    let i = 0;

    setInterval(() => {
        if (i === MOCK_DATA.length) {
            ws.close();
        }
        ws.send(`${MOCK_DATA[i]}`);
        i++;
    }, 1000)
});


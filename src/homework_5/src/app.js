const worker = new Worker('worker.js');

if (window?.Notification?.permission !== 'denied') {
    Notification.requestPermission((status) => {
        if (status === 'granted') {
            const n = new Notification('My Notification test', {
                body: 'Notification test message',
            })
        }
    })
}

document.querySelector('.js-start').addEventListener('click', () => {
    worker.postMessage({command: 'start'})
})

document.querySelector('.js-stop').addEventListener('click', () => {
    worker.postMessage({command: 'stop'})
})

let notification
worker.addEventListener('message', (e) => {

    if (e.data.type === 'message') {
        const message = e.data.payload;

        if (notification) {
            notification.close();
        }

        notification = new Notification(message);
    }
})

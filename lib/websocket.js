const WebSocket = require('ws')
const subscribes = require('./subscribes');


module.exports = function createWebsocketServer(server){

    const wss = new WebSocket.Server({server: server, clientTracking: true, noServer: false});

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                return ws.terminate();
            }
            ws.isAlive = false;
            if (ws['isBrowser']) {
                ws.send("ping")
            } else {
                ws.ping();
            }
        });
    }, 30000);

    wss.on('close', function close() {
        clearInterval(interval);
    });

    wss.on('connection', function (ws, request) {
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });

        ws.send("->: Hi")

        ws.on('message', function (message) {
            if (message === "pong") {
                ws.isAlive = true;
                ws['isBrowser'] = true
            }
            subscribes(wss, ws, message)
            console.log(`Received message ${message} `);
        });

        ws.on('close', function () {
            console.log(`close ${ws}`);
        });
    });


}


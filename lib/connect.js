const WebSocket = require('ws');
const moment = require('moment');

function showMessage(message) {
    console.log(message)
}

function NewWebsocket() {
    const onMessages = [],
        onOpens = [],
        onCloses = [],
        onErrors = []

    let ws = new WebSocket(`ws://localhost:8080/`);

    function heartbeat(conn) {
        clearTimeout(conn.pingTimeout);

        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        conn.pingTimeout = setTimeout(() => {
            conn.terminate();
        }, 30000 + 1000);
    }

    ws.on('error', function (e) {
        console.log(e)
        onErrors.forEach((fn) => fn())
    });

    ws.on('message', function (event) {
        onMessages.forEach((fn) => fn(event.data))
    })
    ws.on('ping', () => {
        heartbeat(ws)
    });
    ws.on('open', function () {
        heartbeat(ws)
        onOpens.forEach((fn) => fn())
    });

    ws.on('close', function () {
        clearTimeout(this.pingTimeout);
        onCloses.forEach((fn) => fn())
        ws = null;
    });

    let tempMsg = [];

    return {
        send: function (msg) {
            if (ws.readyState === WebSocket.OPEN) {
                if (tempMsg.length !== 0) {
                    tempMsg.forEach((m) => {
                        ws.send(m);
                    })
                    tempMsg = []
                    ws.send(msg);
                } else {
                    ws.send(msg);
                }
            } else {
                tempMsg.push(msg)
            }
        },
        close: function () {
            if (ws !== null) {
                ws.terminate();
            }
        },
        addListener(even, fn) {
            if (even === "message") {
                onMessages.push(fn)
            } else if (even === "open") {
                onOpens.push(fn)
            } else if (even === "close") {
                onCloses.push(fn)
            } else if (even === "error") {
                onErrors.push(fn)
            } else {
                console.error("unknown event")
            }
        }
    };
}


module.exports = (function () {
    const ws = NewWebsocket()
    ws.addListener('message', function (d) {
        showMessage(d)
    })
    ws.addListener("open", () => {
        showMessage('WebSocket connection established');
    })
    ws.addListener("close", () => {
        showMessage('WebSocket connection closed');
    })
    return {
        nowTime: function(){
            return moment().format("YYYY-MM-DD, HH:mm:ss:SSSS");
        },
        send: function (msg) {
            if(msg instanceof Object){
                ws.send(JSON.stringify(msg))
            }else{
                ws.send(msg)
            }
        },
        log: function (msg) {
            const time = moment().format("YYYY-MM-DD, HH:mm:ss:SSSS");
            ws.send(`[${time}] ${msg}`)
        },
        error: function (msg) {
            const time = moment().format("YYYY-MM-DD, HH:mm:ss:SSSS");
            ws.send(`[${time}] - [error] - ${msg}`)
        }
    }
})()

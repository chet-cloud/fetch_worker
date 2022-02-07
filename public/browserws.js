function NewWebsocket() {
    const onMessages = [],
        onOpens = [],
        onCloses = [],
        onErrors = []

    let ws = new WebSocket(`ws://${location.host}`);
    let interval

    ws.onerror = function () {
        showMessage('WebSocket error');
        onErrors.forEach((fn) => fn())
    };

    ws.onmessage = function (event) {
        onMessages.forEach((fn) => fn(event.data))
    }

    ws.onopen = function () {
        interval = setInterval(function ping() {
            ws.send('pong')
        }, 30000);
        onOpens.forEach((fn) => fn())
    };

    ws.onclose = function () {
        clearInterval(interval)
        onCloses.forEach((fn) => fn())
        ws = null;
    };

    return {
        send: function (msg) {
            ws.send(msg)
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
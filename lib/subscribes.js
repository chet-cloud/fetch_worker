const WebSocket = require('ws');

module.exports =  function (server, client, message) {

    // just simple broadcast all messages to all clients
    // The Clients pick up the information they need
    server.clients.forEach(function each(conn) {
        if (conn !== client && client.readyState === WebSocket.OPEN) {
            conn.send(message.toString());
        }
    });

}

/*var quickconnect = require('rtc-quickconnect');*/

var peer;
var connection;

var connect = function() {
    var peerId = document.querySelector('#peer').value;
    connection = peer.connect(peerId);
    connection.on('data', processMessage)
};

function processMessage(data) {
    console.log('got message:', data)
    document.querySelector('#status').textContent += data;
}

function sendData() {
    connection.send("Hi there, from peer " + peer.id);
    console.log("sending HI");
}


window.addEventListener('load', function() {
    document.querySelector('#connect').addEventListener('click', connect);
    document.querySelector('#send').addEventListener('click', sendData);

    peer = new Peer({
        key: 'z8s8oerhevuqh0k9'
    });

    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
        document.querySelector('#imei').textContent = id;
    });

    peer.on('connection', function(dc) {
        console.log('Recieved connection from: ' + dc.peer);
        connection = dc;
        connection.on('data', processMessage);
    });

});
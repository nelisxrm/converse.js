var PeerTransfer = function (peerId, options) {
    this.peer = null;
    this.connections = [];
    this.dataHandler = null;

    this.initialize(peerId, options);

    return {
        sendData: this.sendData,
        registerDataHandler: this.registerDataHandler
    }
};

PeerTransfer.prototype.initialize = function (peerId, options) {
    var options = options || {},
        host = options.host || 'localhost',
        port = options.port || 9000,
        key = options.key || 'peerjs';

    if (!peerId) {
        throw new Error('Peer ID is required.');
    }

    this.peer = new Peer(peerId, {host: host, port: port, key: key});

    this.handleReceivedConnections();
};

PeerTransfer.prototype.registerDataHandler = function (handler) {
    if (handler && typeof handler !== 'function') {
        throw new Error('Data handler must be a function.');
    }

    this.dataHandler = handler;
};

PeerTransfer.prototype.sendData = function (remotePeerId, data) {
    var self = this,
        connection = this.getConnection(remotePeerId);

    if (connection.open) {
        this.send(connection, data);
    }
    else {
        connection.on('open', function () {
            self.send(connection, data);
        });
    }
};

PeerTransfer.prototype.send = function (connection, data) {
    console.info('sending data', data);
    connection.send(data);
};

PeerTransfer.prototype.getConnection = function (remotePeerId) {
    var connection = this.getExistingConnection(remotePeerId);

    if (!connection) {
        connection = this.peer.connect(remotePeerId);

        this.registerConnection(connection);
    }

    return connection;
};

PeerTransfer.prototype.getExistingConnection = function (remotePeerId) {
    return this.connections[0];
};

PeerTransfer.prototype.handleReceivedConnections = function () {
    var self = this;

    this.peer.on('connection', function (connection) {
        self.registerConnection(connection);
    })
};

PeerTransfer.prototype.registerConnection = function (connection) {
    this.connections.push(connection);
    this.handleReceivedDataOnConnection(connection);
};

PeerTransfer.prototype.handleReceivedDataOnConnection = function (connection) {
    var self = this;

    connection.on('data', function (data) {
        self.onDataReceived(connection, data)
    });
};

PeerTransfer.prototype.onDataReceived = function (connection, data) {
    this.dataHandler && this.dataHandler(connection, data);
};

PeerTransfer.getFormattedPeerId = function(peerId) {
    var formattedPeerId = peerId.replace(/\W/g, '_');

    return formattedPeerId;
};

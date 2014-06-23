var PeerTransfer = function (peerId, options) {
    this.peer = null;
    this.connections = [];
    this.dataHandler = null;

    this.initialize(peerId, options);

    return {
        sendData: this.sendData.bind(this),
        registerDataHandler: this.registerDataHandler.bind(this)
    };
};

PeerTransfer.prototype.initialize = function (peerId, options) {
    var options = options || {},
        host = options.host || 'localhost',
        port = options.port || 9000,
        key = options.key || 'peerjs';
        formattedPeerId = PeerTransfer.getFormattedPeerId(peerId);

    if (!peerId) {
        throw new Error('Peer ID is required.');
    }

    console.log('peerId', peerId, 'formattedPeerId', formattedPeerId);

    this.peer = new Peer(formattedPeerId, {host: host, port: port, key: key});

    this.handleWindowClosing();
    this.handleReceivedConnections();

    console.info('PeerTransfer initialized', this);
};

PeerTransfer.prototype.registerDataHandler = function (handler) {
    if (handler && typeof handler !== 'function') {
        throw new Error('Data handler must be a function.');
    }

    this.dataHandler = handler;
};

PeerTransfer.prototype.sendData = function (remotePeerId, data) {
    var self = this,
        formattedRemotePeerId = PeerTransfer.getFormattedPeerId(remotePeerId),
        connection = this.getConnection(formattedRemotePeerId);

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
    console.info('sending data', data, 'to', connection.peer);

    connection.send(data);
};

PeerTransfer.prototype.getConnection = function (remotePeerId) {
    var connection = this.getExistingConnection(remotePeerId);

    if (connection && !connection.open) {
        this.deregisterConnection(connection);
    }

    if (!connection || !connection.open) {
        connection = this.peer.connect(remotePeerId);

        this.registerConnection(connection);
    }

    return connection;
};

PeerTransfer.prototype.getExistingConnection = function (remotePeerId) {
    return this.connections[0] || null;
};

PeerTransfer.prototype.handleWindowClosing = function () {
    var self = this;

    window.addEventListener('beforeunload', function () {
        var peer = self.peer;

        console.log('diconnecting peer', peer);

        peer && peer.destroy();
    });
};

PeerTransfer.prototype.handleReceivedConnections = function () {
    var self = this;

    this.peer.on('connection', function (connection) {
        self.registerConnection(connection);
    })
};

PeerTransfer.prototype.deregisterConnection = function (connection) {
    var index = this.connections.indexOf(connection);

    this.connections.splice(index, 1);
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
    console.info('received', data, 'from', connection.peer);

    this.dataHandler && this.dataHandler(connection, data);
};

PeerTransfer.getFormattedPeerId = function (peerId) {
    var formattedPeerId = peerId.replace(/\W/g, '_');

    return formattedPeerId;
};

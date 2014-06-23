var PeerTransfer = function (peerId, options) {
    this.peer = null;
    this.transfers = [];
    this.handlers = {
        proposal: [],
        response: [],
        file: [],
        receipt: []
    };

    this.initialize(peerId, options);

    return {
        on: this.on.bind(this),
        send: this.send.bind(this)
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

/**
 * Registers the given handler to be called when the given event occurs.
 * @param  {String} type
 * @param  {Function} handler
 */
PeerTransfer.prototype.on = function (type, handler) {
    var handlersOfGivenType;

    if (handler && typeof handler !== 'function') {
        throw new Error('Handler must be a function.');
    }

    handlersOfGivenType = this.getHandlersByType(type);

    handlersOfGivenType.push(handler);
};

/**
 * Sends given data to peer corresponding to given remote ID.
 * @param  {String} remotePeerId
 * @param  {Object} data
 */
PeerTransfer.prototype.send = function (remotePeerId, data, callback) {
    var formattedRemotePeerId = PeerTransfer.getFormattedPeerId(remotePeerId),
        transfer = this.getTransfer(formattedRemotePeerId);

    if (transfer.isOpen()) {
        doSend(transfer, data);
    }
    else {
        transfer.connection.on('open', function () {
            doSend(transfer, data);
        });
    }

    function doSend(transfer, data) {
        console.info('sending data', data, 'to', transfer.connection.peer);

        transfer.connection.send(data);

        if (typeof callback === 'function') {
            callback(transfer, data);
        }
    }
};

PeerTransfer.prototype.getHandlersByType = function (type) {
    var handlers;

    if (!type) {
        throw new Error('Handler type must be defined.');
    }

    handlers = this.handlers[type];

    if (!handlers) {
        throw new Error('No such type of handlers.');
    }

    return handlers;
}

PeerTransfer.prototype.getTransfer = function (remotePeerId) {
    var transfer = this.getExistingTransfer(remotePeerId);

    if (transfer && !transfer.isOpen()) {
        this.deregisterTransfer(transfer);
    }

    if (!transfer || !transfer.isOpen()) {
        var connection = this.peer.connect(remotePeerId);

        transfer = this.getNewTransfer(connection);

        this.registerTransfer(transfer);
    }

    return transfer;
};

PeerTransfer.prototype.getNewTransfer = function (connection) {
    var transfer = {
        connection: connection,
        file: null,
        isOpen: function () {
            return this.connection && this.connection.open;
        }
    };

    return transfer;
};

PeerTransfer.prototype.getExistingTransfer = function (remotePeerId) {
    return this.transfers[0] || null; // TODO: filter
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
        var transfer = self.getNewTransfer(connection);
        self.registerTransfer(transfer);
    })
};

PeerTransfer.prototype.deregisterTransfer = function (transfer) {
    var index = this.transfers.indexOf(transfer);

    this.transfers.splice(index, 1);
};

PeerTransfer.prototype.registerTransfer = function (transfer) {
    this.transfers.push(transfer);
    this.handleTransferReceivedData(transfer);
};

PeerTransfer.prototype.handleTransferReceivedData = function (transfer) {
    var self = this;

    transfer.connection.on('data', function (data) {
        self.onDataReceived(transfer, data)
    });
};

PeerTransfer.prototype.onDataReceived = function (transfer, data) {
    var type, handlersOfGivenType;

    console.info('received', data, 'from', transfer.connection.peer);

    if (!data) {
        return;
    }

    type = data.type;
    handlersOfGivenType = this.getHandlersByType(type);

    for (var i = 0; i < handlersOfGivenType.length; i++) {
        var handler = handlersOfGivenType[i];

        handler(transfer, data);
    }
};

PeerTransfer.getFormattedPeerId = function (peerId) {
    var formattedPeerId = peerId.replace(/\W/g, '_');

    return formattedPeerId;
};

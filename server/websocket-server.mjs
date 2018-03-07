import SocketIO from 'socket.io';

export default class WebSocketServer {
  constructor() {
    this.io = null;
    this.messageHandlers = {};
    this.boardToClientsViewingMap = {};

    // Bind the current context to the following functions (weird JS thing)
    this.start = this.start.bind(this);
    this.onClientConnect = this.onClientConnect.bind(this);
    this.broadcastBoardUpdate = this.broadcastBoardUpdate.bind(this);
    this.broadcastBoardListUpdate = this.broadcastBoardListUpdate.bind(this);
    this.registerMessageHandler = this.registerMessageHandler.bind(this);
  }

  start(httpServer) {
    this.io = new SocketIO(httpServer);
    console.log('WebSocket server started successfully.');
    this.io.on('connection', this.onClientConnect);
  }

  /**
   * Called when a WebSockets client connects.
   * @param socket - the socket.io connection
   */
  onClientConnect(socket) {
    console.log('Client connected');
    // Register the message handlers
    Object.keys(this.messageHandlers).forEach((msgName) => {
      socket.on(msgName, data => this.messageHandlers[msgName](data, socket));
    });
    socket.on('boardUpdate', (data) => {
      if (Object.hasOwnProperty.call(this.messageHandlers, 'boardUpdate')) {
        this.messageHandlers.boardUpdate(data, socket);
      }
    });
    socket.on('disconnect', () => this.onClientDisconnect(socket));
  }

  /**
   * Broadcasts a complete list of boards to all connected clients.
   * @param boardList - the list to broadcast
   */
  broadcastBoardListUpdate(boardList) {
    this.io.emit('boardListUpdate', boardList);
  }

  broadcastBoardUpdate(boardElement, originatingSocket) {
    // this.io.emit('boardUpdate', boardElement);
    originatingSocket.broadcast.emit('boardUpdate', boardElement); // Only sends the updated state to the client who didn't send.
    // TODO Support having multiple boards open
  }

  registerMessageHandler(msgName, callback) {
    this.messageHandlers[msgName] = callback;
  }

  onClientDisconnect(socket) {
    console.log('Client disconnected');
  }
}

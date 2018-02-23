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

  onClientConnect(socket) {
    console.log('Client connected');
    // Register the message handlers
    Object.keys(this.messageHandlers).forEach((msgName) => {
      socket.on(msgName, data => this.messageHandlers[msgName](data, socket));
    });
    socket.on('boardUpdate', data => this.boardUpdateReceived(data, socket));
    socket.on('disconnect', () => this.onClientDisconnect(socket));
  }

  broadcastBoardListUpdate(boardList) {
    this.io.emit('boardListUpdate', boardList);
  }

  broadcastBoardUpdate(boardName, boardElement, originatingSocket) {
    if (Object.hasOwnProperty.call(this.boardToClientsViewingMap, boardName)) {
      // Get the list of sockets with this board currently open
      const clients = this.boardToClientsViewingMap[boardName];
      // Broadcast the update to each client
      clients.forEach((socket) => {
        if (socket !== originatingSocket) { // Don't send the message to the sender
          socket.emit('boardUpdate', boardElement); // TODO Support having multiple boards open
        }
      });
    }
  }

  registerMessageHandler(msgName, callback) {
    this.messageHandlers[msgName] = callback;
  }

  onClientDisconnect(socket) {
    console.log('Client disconnected');
  }
}

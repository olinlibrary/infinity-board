import SocketIO from 'socket.io';

/**
 * A WebSockets server for keeping bidirectional data channels open for real-time communication.
 * All communication between the client app and server is done using WebSockets.
 */
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

  /**
   * Starts the WebSockets server.
   * @param httpServer - the Express HTTP server to use
   */
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

  /**
   * Sends a message to all of the connected clients (excluding the original emitter of the update)
   * with information about the new or modified board element.
   * @param boardElement - the board element that was added or changed
   * @param originatingSocket - the WebSocket connection to the client that emitted the update
   */
  broadcastBoardUpdate(boardElement, originatingSocket) {
    // this.io.emit('boardUpdate', boardElement);
    originatingSocket.broadcast.emit('boardUpdate', boardElement); // Only sends the updated state to the client who didn't send.
    // TODO Support having multiple boards open
  }

  /**
   * Use this to register a callback function for a WebSockets event.
   * @param {string} eventName - the name of the WebSockets event to listen for
   * @param {function} callback - the function to call when the event has occurred. The event
   * payload and the emitting socket will be passed as arguments (in that order).
   */
  registerMessageHandler(eventName, callback) {
    this.messageHandlers[eventName] = callback;
  }

  onClientDisconnect(socket) {
    console.log('Client disconnected');
  }
}

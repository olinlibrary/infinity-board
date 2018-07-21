import SocketIO from 'socket.io';
import randomColor from 'randomcolor';


/**
 * A WebSockets server for keeping bidirectional data channels open for real-time communication.
 * All communication between the client app and server is done using WebSockets.
 */
export default class WebSocketServer {
  constructor() {
    this.SharedActionTypes = {
      SET_DRAGGING: 'SET_DRAGGING',
      SET_POSITION: 'SET_POSITION',
      GENERATE_BOX: 'GENERATE_BOX',
      RESIZE_BOX: 'RESIZE_BOX',
      DELETE_BOX: 'DELETE_BOX',
      UPDATE_TEXT: 'UPDATE_TEXT',
      SET_EDITING: 'SET_EDITING',
      SET_IMG_LOADED: 'SET_IMG_LOADED',
      SET_FRONT_BOX: 'SET_FRONT_BOX',
    };
    this.io = null;
    this.updateHandler = null;
    this.messageHandlers = {};
    this.boardToClientsViewingMap = {};
    this.clientsToBoardsViewingMap = {};
    this.boardToClientPosMap = {};

    // Bind the current context to the following functions (weird JS thing)
    this.start = this.start.bind(this);
    this.onClientConnect = this.onClientConnect.bind(this);
    this.broadcastBoardUpdate = this.broadcastBoardUpdate.bind(this);
    this.broadcastBoardListUpdate = this.broadcastBoardListUpdate.bind(this);
    this.registerMessageHandler = this.registerMessageHandler.bind(this);
    this.registerUpdateHandler = this.registerUpdateHandler.bind(this);
    this.broadcastClientUpdate = this.broadcastClientUpdate.bind(this);
    this.registerSocketWithBoard = this.registerSocketWithBoard.bind(this);
    this.deregisterClientFromBoards = this.deregisterClientFromBoards.bind(this);
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
      socket.on(msgName, data =>
        this.messageHandlers[msgName](data, socket, this.registerSocketWithBoard));
    });

    // Set up the handler for Redux actions for the socket
    Object.keys(this.SharedActionTypes).forEach(type =>
      socket.on(type, (payload) => {
        this.updateHandler(type, payload, socket)
      }))
    // Dot indicating where other people are looking
    socket.on('clientUpdate', data => this.broadcastClientUpdate(data, socket));

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
   */
  broadcastBoardUpdate(type, payload, originatingSocket) {
    const newPayload = Object.assign({}, payload)
    const clientsUsingBoard = this.boardToClientsViewingMap[newPayload.boardName];
    // console.log(newPayload)
    if (clientsUsingBoard) {
      clientsUsingBoard.forEach((socket) => {
        if (socket !== originatingSocket) {
          if (socket.connected) {
            socket.emit(type, newPayload);
          } else {
            this.deregisterClientFromBoards(socket); // Socket no longer connected
          }
        }
      });
    }
  }

  broadcastClientUpdate(data, originatingSocket) {
    const board = this.clientsToBoardsViewingMap[originatingSocket.id];
    if (board) {
      // Updating list of client states
      const newClientList = Object.assign(
        {},
        this.boardToClientPosMap[board][originatingSocket.id],
        data
      );
      this.boardToClientPosMap[board][originatingSocket.id] = newClientList;

      // Send client updates
      this.boardToClientsViewingMap[board].forEach((socket) => {
        if (socket !== originatingSocket) {
          if (socket.connected) {
            socket.emit('clientUpdate', this.boardToClientPosMap[board]);
          } else {
            this.deregisterClientFromBoards(socket); // Socket no longer connected
          }
        }
      });
    }
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

  /**
   * Used to set the handler callback for board updates
  */
  registerUpdateHandler(callback) {
    this.updateHandler = callback;
  }

  onClientDisconnect(socket) {
    console.log('Client disconnected');
    this.deregisterClientFromBoards(socket);
    // Remove the client from the list of clients currently connected
    delete this.clientsToBoardsViewingMap[socket];
  }

  registerSocketWithBoard(socket, boardId) {
    this.deregisterClientFromBoards(socket.id);
    if (!Object.hasOwnProperty.call(this.boardToClientsViewingMap, boardId)) {
      this.boardToClientsViewingMap[boardId] = [];
    }
    this.clientsToBoardsViewingMap[socket.id] = boardId;
    if (boardId) { // Will be null if clearing open board for client
      this.boardToClientsViewingMap[boardId].push(socket);

      // Handle clients viewing map
      if (!Object.hasOwnProperty.call(this.boardToClientPosMap, boardId)) {
        // If map doesn't exist, create it
        this.boardToClientPosMap[boardId] = {};
      }
      this.boardToClientPosMap[boardId][socket.id] = { x: 0, y: 0, color: randomColor() };
    }
  }

  deregisterClientFromBoards(socket) {
    const openBoard = this.clientsToBoardsViewingMap[socket];
    if (openBoard) {
      // Remove from position map
      delete this.boardToClientPosMap[openBoard][socket];
      // Remove the socket from the list of connected devices for this board
      const boardConnectedClients = this.boardToClientsViewingMap[openBoard];
      boardConnectedClients.splice(boardConnectedClients.indexOf(socket), 1);
    }
  }
}

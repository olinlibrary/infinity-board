import Board from './board.mjs';
import DatabaseConnection from './database.mjs';
import WebSocketServer from './websocket-server.mjs';

export default class BoardManager {
  constructor(httpServer) {
    this.boards = {};
    this.boardListUpdateEventHandlers = [];
    this.dbConn = new DatabaseConnection();
    this.dbConn.connect();

    // Start the WebSockets server
    this.wsServer = new WebSocketServer();
    this.wsServer.start(httpServer.getHTTPServer());

    // Register WebSocket message handlers
    this.wsServer.registerMessageHandler('createBoard', this.createBoard);
    this.wsServer.registerMessageHandler('boardUpdate', this.receivedBoardUpdate);

    // Bind contexts
    this.createBoard = this.createBoard.bind(this);
    this.receivedBoardUpdate = this.receivedBoardUpdate.bind(this);
    this.getBoardList = this.getBoardList.bind(this);
  }

  /**
   * Creates a new board and notifies all connected clients (not including the
   * one initiating the board creation).
   * @param {object} msg - the WebSockets message from the client
   * @param socket - the sockets.io connection to the client requesting the
   * creation of a board
   * @return {Promise<any>} a Promise that resolves with the newly created board
   */
  createBoard(msg, socket) {
    return new Promise((resolve, reject) => {
      this.dbConn.createBoard(msg.name).then((boardDbObj) => {
        // Instantiate a Board object
        const board = new Board(boardDbObj);

        // Save the board to our list of open boards
        this.boards[board.getName()] = board;

        // Register this board with the WebSockets server
        // (or anything else that wants to be notified of board creation)
        this.boardListUpdateEventHandlers.forEach(handler => handler());

        // Let all the connected clients know about the new board
        this.wsServer.broadcastBoardListUpdate(this.getBoardList());
        // Send a creation confirmation message to the primary client
        // (should trigger displaying/opening board)
        socket.emit('boardCreated', board.serialize());

        resolve(board);
      }, (err) => {
        reject(err);
      });
    });
  }

  /**
   * Called when a boardUpdate message is received from one of the WebSocket clients.
   * @param {object} msg - the message from the client
   * @param socket - the socket.io connection
   */
  receivedBoardUpdate(msg, socket) {
    console.log('Received update message:');
    console.log(msg);
    // TODO Apply the update to the local copy of the board and the database

    this.wsServer.broadcastBoardUpdate(msg.name, msg, socket);
    // bm.receivedBoardUpdate(msg);

    // TODO Get name and changed element info from msg
    this.wsServer.broadcastBoardUpdate(msg, socket);
  }

  getBoardList() {
    return Object.values(this.boards).map(board => ({
      name: board.getName(),
      id: board.getId(),
      created: board.getCreatedTime(),
      lastUsed: board.getLastUsedTime(),
    }));
  }
}

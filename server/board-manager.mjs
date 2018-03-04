import Board from './board.mjs';
import DatabaseConnection from './database.mjs';
import WebSocketServer from './websocket-server.mjs';

export default class BoardManager {
  constructor(httpServer) {
    this.boards = {};
    this.boardListUpdateEventHandlers = [];
    this.dbConn = new DatabaseConnection();
    this.dbConn.connect().then(() => this.fetchBoardsFromDb());

    // Start the WebSockets server
    this.wsServer = new WebSocketServer();
    this.wsServer.start(httpServer.getHTTPServer());

    // Bind contexts
    this.createBoard = this.createBoard.bind(this);
    this.receivedBoardUpdate = this.receivedBoardUpdate.bind(this);
    this.handleBoardListRequest = this.handleBoardListRequest.bind(this);
    this.getBoardList = this.getBoardList.bind(this);

    // Register WebSocket message handlers
    this.wsServer.registerMessageHandler('createBoard', this.createBoard);
    this.wsServer.registerMessageHandler('boardUpdate', this.receivedBoardUpdate);
    this.wsServer.registerMessageHandler('getBoardList', this.handleBoardListRequest);
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
    const boards = this.getBoardList();
    const board = new Board(boards[msg.boardId]);
    board.applyElementUpdate(msg);
    this.dbConn.saveBoard(board.data);

    this.wsServer.broadcastBoardUpdate(msg, socket);
  }

  handleBoardListRequest(data, socket) {
    console.log('Responding to board list request');
    const boards = this.getBoardList();
    console.log(boards)
    socket.emit('boardListUpdate', boards);
  }

  fetchBoardsFromDb() {
    this.dbConn.listBoards().then((boards) => {
      this.boards = boards;
      console.log('Got boards from db:');
      console.log(this.boards);
    });
  }

  getBoardList() {
    const map = {};
    this.boards.forEach((board) => {
      // eslint-disable-next-line no-underscore-dangle
      map[board._id] = board;
    });
    return map;
    // return Object.values(this.boards).map(board => ({
    //   name: board.getName(),
    //   id: board.getId(),
    //   created: board.getCreatedTime(),
    //   lastUsed: board.getLastUsedTime(),
    // }));
  }
}

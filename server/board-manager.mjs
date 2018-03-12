import DatabaseConnection from './database.mjs';
import WebSocketServer from './websocket-server.mjs';

/**
 * The BoardManager keeps track of the states of all the boards. It is also responsible for
 * dispatching updates to the database and handling any updates received from clients.
 */
export default class BoardManager {
  /**
   * Instantiates a new BoardManager.
   * @param httpServer - the Express HTTP server to use for receiving client connections.
   */
  constructor(httpServer) {
    this.boards = [];
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
    this.getBoardData = this.getBoardData.bind(this);

    // Register WebSocket message handlers
    this.wsServer.registerMessageHandler('createBoard', this.createBoard);
    this.wsServer.registerMessageHandler('boardUpdate', this.receivedBoardUpdate);
    this.wsServer.registerMessageHandler('getBoardList', this.handleBoardListRequest);
    this.wsServer.registerMessageHandler('getBoardData', this.getBoardData);
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
      const name = msg ? msg.name : null;
      this.dbConn.createBoard(name).then((board) => {
        // Save the board to our list of open boards
        // eslint-disable-next-line no-underscore-dangle
        this.boards.push(board);

        // Register this board with the WebSockets server
        // (or anything else that wants to be notified of board creation)
        this.boardListUpdateEventHandlers.forEach(handler => handler());

        // Let all the connected clients know about the new board
        this.wsServer.broadcastBoardListUpdate(this.getBoardList());
        // Send a creation confirmation message to the primary client
        // (should trigger displaying/opening board)
        socket.emit('boardData', board);

        resolve(board);
      }, (err) => {
        reject(err);
      });
    });
  }

  /**
   * Called when a boardUpdate message is received from one of the WebSocket clients.
   * @param {object} element - the updated board element from the client
   * @param socket - the socket.io connection
   */
  receivedBoardUpdate(element, socket) {
    const boards = this.getBoardList();
    const boardData = boards[element.boardId];
    boardData.elements[element.uuid] = {
      state: element.state,
      type: element.type,
    };
    board.zIndex = element.zIndex;
    // Save the board to the database
    this.dbConn.saveBoard(boardData);

    // Broadcast the update to the other connected clients
    this.wsServer.broadcastBoardUpdate(element, socket);
  }

  /**
   * Called when a client requests a list of all the boards.
   * @param data - the WebSockets message payload (should be null)
   * @param socket - the WebSockets connection to the client requesting the list
   * @private
   */
  handleBoardListRequest(data, socket) {
    const boards = this.getBoardList();
    socket.emit('boardListUpdate', boards);
  }

  /**
   * Updates the list of boards by querying the MongoDB database.
   * @private
   */
  fetchBoardsFromDb() {
    this.dbConn.listBoards().then((boards) => {
      this.boards = boards;
    });
  }

  /**
   * Gets the list of boards.
   * @return {{object}} the list of boards
   */
  getBoardList() {
    const map = {};
    this.boards.forEach((board) => {
      // eslint-disable-next-line no-underscore-dangle
      map[board._id] = board;
    });
    return map;
  }

  /**
   * Gets all the data associated with a board, including its elements.
   * @param {string} boardId - the UUID of the board to look up
   * @param socket - the WebSockets connection to the client requesting the data
   */
  getBoardData(boardId, socket) {
    this.dbConn.getBoard(null, boardId).then((board) => {
      socket.emit('boardData', board);
    });
  }
}

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
    this.handleBoardUpdate = this.handleBoardUpdate.bind(this);
    this.getBoardList = this.getBoardList.bind(this);
    this.getBoardData = this.getBoardData.bind(this);

    // Register WebSocket message handlers
    this.wsServer.registerMessageHandler('createBoard', this.createBoard);
    this.wsServer.registerMessageHandler('getBoardList', this.handleBoardListRequest);
    this.wsServer.registerMessageHandler('getBoardData', this.getBoardData);
    this.wsServer.registerMessageHandler('updateBoard', this.handleBoardUpdate);

    // Register the handler for board update messages
    this.wsServer.registerUpdateHandler(this.receivedBoardUpdate);
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
   * @param type - the type of the message (defined by the Redux action)
   * @param {object} payload - the payload of the message
   */
  receivedBoardUpdate(type, payload, originatingSocket) {
    // Broadcast the update to the other connected clients
    this.wsServer.broadcastBoardUpdate(type, payload, originatingSocket);
    // Save the board to the database
    // this.dbConn.saveBoard(boardData);
    // TODO replace this bit with an actual bit of code
  }

  /*
  * Handles a full board store update from a client.
  *
  */
  handleBoardUpdate(data) {
    const reducer = Object.assign({}, data.store.boardReducer);
    if (reducer.hasOwnProperty('curDragging')) {
      delete reducer.curDragging;
    }
    this.dbConn.saveBoard(data.boardName, reducer)
  }

  /**
   * Called when a client requests a list of all the boards.
   * @param data - the WebSockets message payload (should be null)
   * @param socket - the WebSockets connection to the client requesting the list
   * @param registerSocketWithBoard - lets the WebSockets server know which board
   * the current client is viewing
   * @private
   */
  handleBoardListRequest(data, socket, registerSocketWithBoard) {
    const boards = this.getBoardList();
    socket.emit('boardListUpdate', boards);
    registerSocketWithBoard(socket, null);
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
   * @param {object} query - the UUID or name of the board to look up
   * @param socket - the WebSockets connection to the client requesting the data
   * @param registerSocketWithBoard - lets the WebSockets server know which board
   * the current client is viewing
   */
  getBoardData(query, socket, registerSocketWithBoard) {
    this.dbConn.getBoard(query.name, query.id).then((board) => {
      // eslint-disable-next-line no-underscore-dangle
      registerSocketWithBoard(socket, board._id);
      socket.emit('boardData', board);
    });
  }
}

import SocketIO from 'socket.io-client';

/**
 * Enables communication with the InfinityBoard backend server, handling all data transfers.
 */
export default class ServerComm {
  constructor(serverURL) {
    this.serverURL = serverURL;
    this.receivedUpdateMessageHandler = null;
    this.receivedBoardListMessageHandler = null;
    this.receivedBoardDataMessageHandler = null;
  }

  /**
   * Called when a WebSockets connection is established with the server.
   */
  connect = () => {
    this.io = SocketIO(this.serverURL);
    this.io.on('boardUpdate', msg => this.receivedBoardUpdateMessage(msg, this.io));
    this.io.on('boardListUpdate', msg => this.receivedBoardListUpdate(msg, this.io));
    this.io.on('boardData', msg => this.receivedFullBoardDataMessage(msg, this.io));
  };


  /**
   * Called when a 'message' socket.io event is received.
   * @param msg - the update message payload from the server
   * @param socket - the socket.io connection to the server
   */
  receivedBoardUpdateMessage = (msg, socket) => {
    if (this.receivedUpdateMessageHandler) {
      this.receivedUpdateMessageHandler(msg, socket);
    }
  };

  /**
   * Called when a complete data for a board is received from the server (a 'boardUpdate' event).
   * @param data - the message payload
   * @param socket - the socket.io connection to the server
   */
  receivedFullBoardDataMessage = (data, socket) => {
    if (this.receivedBoardDataMessageHandler) {
      this.receivedBoardDataMessageHandler(data, socket);
    }
  };

  /**
   * Registers a function to be called when an updated list of boards is received
   * from the server. (Only one function can be registered at a time.)
   * @param callback - the function to call when a 'boardListUpdate' event is received
   */
  receivedBoardListUpdate = (callback) => {
    if (this.receivedBoardListMessageHandler) {
      this.receivedBoardListMessageHandler(callback);
    }
  };

  /**
   * Registers a function to be called when a board update message is received.
   * @param callback - the function to call when an 'update' message is received
   */
  setReceivedUpdateMessageHandler = (callback) => {
    this.receivedUpdateMessageHandler = callback;
  };

  /**
   * Registers a function to be called when a board list message is received.
   * @param callback - the function to call when a 'boardListUpdate' message is received
   */
  setReceivedBoardListMessageHandler = (callback) => {
    this.receivedBoardListMessageHandler = callback;
  };

  setReceivedBoardDataMessageHandler = (callback) => {
    this.boardUpdateMessageHandler = callback;
  };

  /**
   * Registers a function to be called when a board list message is received.
   * @param callback - the function to call when a 'boardListUpdate' message is received
   */
  setReceivedBoardDataMessageHandler = (callback) => {
    this.receivedBoardDataMessageHandler = callback;
  };

  /**
   * Broadcasts a board change/update event to the server.
   * @param data - the data to change (e.g. modified board elements)
   */
  sendUpdateMessage = (data) => {
    this.io.emit('boardUpdate', data);
  };

  /**
   * Requests a list of boards from the server.
   */
  getBoardList = () => {
    this.io.emit('getBoardList');
  };

  /**
   * Requests the full board data for a particular board.
   * @param {string} id - the UUID of the board
   * @param {string} name - the human-memorable name
   */
  getBoardData = (id, name) => {
    this.io.emit('getBoardData', { id, name });
  };

  /**
   * Creates a new board. The server will emit an event when the creation is completed.
   */
  createBoard = () => {
    this.io.emit('createBoard');
  }
}

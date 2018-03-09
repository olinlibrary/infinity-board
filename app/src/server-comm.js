import SocketIO from 'socket.io-client';

/**
 * Enables communication with the InfinityBoard backend server, handling all data transfers.
 */
export default class ServerComm {
  constructor(serverURL) {
    this.serverURL = serverURL;
    this.receivedUpdateMessageHandler = null;
    this.receivedBoardListMessageHandler = null;
    this.boardUpdateMessageHandler = null;
  }

  /**
   * Called when a WebSockets connection is established with the server.
   */
  connect = () => {
    this.io = SocketIO(this.serverURL);
    this.io.on('boardUpdate', msg => this.receivedUpdateMessage(msg, this.io));
    this.io.on('boardListUpdate', msg => this.registerBoardListMessageHandler(msg, this.io));
    this.io.on('boardData', msg => this.handleFullBoardDataMessageReceived(msg, this.io));
  };


  /**
   * Called when a 'message' socket.io event is received.
   * @param msg - the update message payload from the server
   * @param socket - the socket.io connection to the server
   */
  receivedUpdateMessage = (msg, socket) => {
    if (this.receivedUpdateMessageHandler) {
      this.receivedUpdateMessageHandler(msg, socket);
    }
  };

  /**
   * Called when a complete data for a board is received from the server (a 'boardUpdate' event).
   * @param data - the message payload
   * @param socket - the socket.io connection to the server
   */
  handleFullBoardDataMessageReceived = (data, socket) => {
    if (this.boardUpdateMessageHandler) {
      this.boardUpdateMessageHandler(data, socket);
    }
  };

  /**
   * Registers a function to be called when an updated list of boards is received
   * from the server. (Only one function can be registered at a time.)
   * @param callback - the function to call when a 'boardListUpdate' event is received
   */
  registerBoardListMessageHandler = (callback) => {
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
   */
  getBoardData = (id) => {
    this.io.emit('getBoardData', id);
  };
}

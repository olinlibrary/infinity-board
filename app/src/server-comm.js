import SocketIO from 'socket.io-client';
import { SharedActionTypes } from './data/board-actions';

/**
 * Enables communication with the InfinityBoard backend server, handling all data transfers.
 */
export default class ServerComm {
  constructor(serverURL) {
    this.comm = SocketIO(serverURL);
    this.boardName = null;
  }

  setBoardName = (name) => {
    this.boardName = name;
  }

  /**
   * Broadcasts a Redux action from the websocket.
   * @param action: the Redux action to broadcast.
  */
  broadcastMessage = (action) => {
    this.comm.emit(action.type, {
      boardName: this.boardName,
      originatingSocket: this.comm.id,
      ...action,
    });
  };

  /**
   * Broadcasts the updated board state via the websocket.
  */
  broadcastBoardState = (store) => {
    this.comm.emit('updateBoard', { boardName: this.boardName, store: store.getState() });
  }


  /**
   * Called to initialize websocket handlers with store actions to dispatch
   * @param store - the Redux store to pass in
  */
  initializeSocket = (store) => {
    Object.keys(SharedActionTypes).forEach(type =>
      this.comm.on(type, (payload) => {
        store.dispatch({ type, ...payload });
      }));

    this.comm.on('boardListUpdate', msg => this.receivedBoardListUpdate(msg, this.comm));
    this.comm.on('boardData', msg => this.receivedFullBoardDataMessage(msg, this.comm));
    this.comm.on('clientUpdate', msg => this.receivedClientUpdateMessage(msg, this.comm, store));
  }

  /**
   * Called as middleware in the Redux store. Sends websocket updates on action dispatch.
   */
  socketEmit = store => next => (action) => {
    // This action has to be performed first in order to get the box data
    if (action.type === 'DELETE_BOX') {
      const curBox = store.getState().boardReducer.boxes[action.uuid];
      this.removeFromS3(curBox.key);
    }

    // Action must be performed before propagating state
    const result = next(action);
    // Don't broadcast if the received message has an originating socket
    if (Object.values(SharedActionTypes).indexOf(action.type) !== -1 && !('originatingSocket' in action)) {
      // Broadcast the message
      this.broadcastMessage(action);
      // Broadcast updated board state to server
      this.broadcastBoardState(store);
    } else if (action.type === 'SET_WINDOW_POS') {
      this.sendClientUpdate({
        x: action.xVal - (action.innerWidth / 2),
        y: action.yVal - (action.innerHeight / 2),
      });
    }
    return result;
  }

  /**
   * Called when a complete data for a board is received from the server (a 'boardUpdate' event).
   * @param data - the message payload
   * @param socket - the socket.io connection to the server
   */
  receivedFullBoardDataMessage = (data, socket) => {
    // console.log("Board data")
    // console.log(data)
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
   * Called when an update on the clients' status is received
   * @param msg - the message payload
   * @param socket - the socket.io connection to the server
   */
  receivedClientUpdateMessage = (msg, socket, store) => {
    store.dispatch({ type: 'UPDATE_CLIENTS', clients: msg });
  };

  /**
   * Registers a function to be called when a board list message is received.
   * @param callback - the function to call when a 'boardListUpdate' message is received
   */
  setReceivedBoardListMessageHandler = (callback) => {
    this.receivedBoardListMessageHandler = callback;
  };

  /**
   * Registers a function to be called when an update in client positions is received.
   * @param callback - the function to call when a 'clientUpdate' message is received.
  */
  setReceivedClientMessageHandler = (callback) => {
    this.receivedClientUpdateMessageHandler = callback;
  };

  /**
   * Registers a function to be called when a board list message is received.
   * @param callback - the function to call when a 'boardListUpdate' message is received
   */
  setReceivedBoardDataMessageHandler = (callback) => {
    this.receivedBoardDataMessageHandler = callback;
  };

  /**
   * Broadcasts a client list update event to the server.
   * @param data - the data to change (e.g. client positions)
   */
  sendClientUpdate = (data) => {
    this.comm.emit('clientUpdate', data);
  };

  /**
   * Requests a list of boards from the server.
   */
  getBoardList = () => {
    this.comm.emit('getBoardList');
  };

  /**
   * Requests the full board data for a particular board.
   * @param {string} id - the UUID of the board
   * @param {string} name - the human-memorable name
   */
  getBoardData = (id, name) => {
    this.comm.emit('getBoardData', { id, name });
  };

  /**
   * Creates a new board. The server will emit an event when the creation is completed.
   */
  createBoard = () => {
    this.comm.emit('createBoard');
  }

  /**
   * Removes a given image from an S3 bucket. Called when an image box is deleted.
   * @param {string} key: The key to the object in the S3 bucket.
   */
  removeFromS3 = (key) => {
    this.comm.emit('deleteImage', key);
  }
}

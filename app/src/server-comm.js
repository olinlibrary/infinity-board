import SocketIO from 'socket.io-client';

export default class ServerComm {
  constructor(serverURL) {
    this.serverURL = serverURL;
    this.receivedUpdateMessageHandler = null;
    this.receivedBoardListMessageHandler = null;
    this.receivedBoardDataMessageHandler = null;
  }

  connect = () => {
    this.io = SocketIO(this.serverURL);
    this.io.on('boardUpdate', msg => this.receivedUpdateMessage(msg, this.io));
    this.io.on('boardListUpdate', msg => this.receivedBoardListMessage(msg, this.io));
    this.io.on('boardData', msg => this.receivedBoardListDataMessage(msg, this.io));
  };


  receivedUpdateMessage = (msg, socket) => {
    if (this.receivedUpdateMessageHandler) {
      this.receivedUpdateMessageHandler(msg, socket);
    }
  };

  receivedBoardListDataMessage = (data, socket) => {
    if (this.receivedBoardDataMessageHandler) {
      this.receivedBoardDataMessageHandler(data, socket);
    }
  };

  receivedBoardListMessage = (callback) => {
    if (this.receivedBoardListMessageHandler) {
      this.receivedBoardListMessageHandler(callback);
    }
  };

  setReceivedUpdateMessageHandler = (callback) => {
    this.receivedUpdateMessageHandler = callback;
  };

  setReceivedBoardListMessageHandler = (callback) => {
    this.receivedBoardListMessageHandler = callback;
  };

  setReceivedBoardDataMessageHandler = (callback) => {
    this.receivedBoardDataMessageHandler = callback;
  };

  sendUpdateMessage = (data) => {
    this.io.emit('boardUpdate', data);
  };

  getBoardList = () => {
    this.io.emit('getBoardList');
  };

  getBoardData = (id) => {
    this.io.emit('getBoardData', id);
  };
}

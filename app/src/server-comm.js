import SocketIO from 'socket.io-client';
import util from 'util';

export default class ServerComm {
  constructor(serverURL) {
    this.serverURL = serverURL;
    this.receivedUpdateMessageHandler = null;
    this.receivedBoardListMessageHandler = null;
  }

  connect = () => {
    this.io = SocketIO(this.serverURL);
    this.io.on('boardUpdate', msg => this.receivedUpdateMessage(msg, this.io));
    this.io.on('boardListUpdate', msg => this.receivedBoardListMessageHandler(msg, this.io));
  };


  receivedUpdateMessage = (msg, socket) => {
    if (this.receivedUpdateMessageHandler) {
      this.receivedUpdateMessageHandler(msg, socket);
    }
  };

  setReceivedUpdateMessageHandler = (callback) => {
    this.receivedUpdateMessageHandler = callback;
  };

  setReceivedBoardListMessageHandler = (callback) => {
    this.receivedBoardListMessageHandler = callback;
  };

  receivedBoardListMessageHandler = (callback) => {
    console.log('Received board list update');
    if (this.receivedBoardListMessageHandler) {
      this.receivedBoardListMessageHandler(callback);
    }
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

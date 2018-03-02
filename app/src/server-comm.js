import SocketIO from 'socket.io-client';
import util from 'util';

export default class ServerComm {
  constructor(serverURL) {
    this.serverURL = serverURL;
    this.receivedUpdateMessageHandler = null;
  }

  connect = () => new Promise((resolve) => {
    this.serverComm = SocketIO(this.serverURL);

    this.serverComm.on('connection', () => {
      console.log('Connected to server');
      resolve(this.serverComm);
    });
    this.serverComm.on('boardUpdate', msg => this.receivedUpdateMessage(this.serverComm, msg));
  });


  receivedUpdateMessage = (socket, msg) => {
    if (this.receivedUpdateMessageHandler) {
      this.receivedUpdateMessageHandler(msg, socket);
    }
  };

  setReceivedUpdateMessageHandler = (callback) => {
    this.receivedUpdateMessageHandler = callback;
  };

  sendUpdateMessage = (data) => {
    this.serverComm.emit('boardUpdate', data);
  };
}

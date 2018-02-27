import SocketIO from 'socket.io-client';
import util from 'util';

export default class ServerComm {
  constructor(serverURL) {
    this.serverURL = serverURL;
  }

  connect = () => new Promise((resolve) => {
    this.serverComm = SocketIO(this.serverURL);
    this.receivedUpdateMessageHandler = null;

    this.serverComm.on('connection', () => {
      console.log('Connected to server');
      resolve(this.serverComm);
    });
    this.serverComm.on('update', msg => this.receivedUpdateMessage(this.serverComm, msg));
  });


  receivedUpdateMessage = (socket, msg) => {
    console.log('Received update message');
    console.log(util.inspect(msg));
    if (this.receivedUpdateMessageHandler) {
      this.receivedUpdateMessageHandler(msg);
    }
    // console.log(util.inspect(this))
    this.serverComm.emit('boardUpdate', 'Got your message, bro!');
  };

  setReceivedUpdateMessageHandler = (callback) => {
    this.receivedUpdateMessageHandler = callback;
  };

  sendUpdateMessage = (data) => {
    this.serverComm.emit('boardUpdate', data);
  };
}

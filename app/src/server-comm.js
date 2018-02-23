import SocketIO from 'socket.io-client';
import util from 'util';

export default class ServerComm {

    constructor(serverURL) {
        this.socket = SocketIO(serverURL);
        this.receivedUpdateMessageHandler = null;

        this.socket.on('connection', () => console.log('Connected to server'));
        this.socket.on('update', msg => this.receivedUpdateMessage(this.socket, msg));

    }

    receivedUpdateMessage(socket, msg) {
        console.log('Received update message');
        console.log(util.inspect(msg));
        if (this.receivedUpdateMessageHandler) {
            this.receivedUpdateMessageHandler(msg);
        }
        // console.log(util.inspect(this))
        this.socket.emit('boardUpdate', 'Got your message, bro!')
    }

    setReceivedUpdateMessageHandler(callback) {
        this.receivedUpdateMessageHandler = callback;
    }

}

import SocketIO from 'socket.io';
import util from 'util';

export default class WebSocketServer {

    constructor(boardManager) {
        this.io = null;
        this.boardManager = boardManager;
        this.namespaces = {};

        // Register our handler to be called when a board is created
        if (boardManager) {
            boardManager.registerBoardCreationEventHandler(this.registerNewBoardNamespace);
        }

        // Bind the current context to the following functions (weird JS thing)
        this.registerNewBoardNamespace = this.registerNewBoardNamespace.bind(this);
        this.onClientConnection = this.onClientConnection.bind(this);
        this.boardUpdateReceived = this.boardUpdateReceived.bind(this);
    }

    start(httpServer) {
        this.io = new SocketIO(httpServer);
        console.log(`WebSocket server started successfully.`)
    }

    registerNewBoardNamespace(board) {
        const name = board.getName();
        if (this.namespaces.hasOwnProperty(name)) {
            console.warn(`Attempted to register board named ${name} twice.`);
            return;
        }
        // Register the new namespace with sockets.io
        let newNs = this.io.of(name);
        newNs = this.io.of(`/${newNs}`);
        newNs.on('connection', this.onClientConnect);
        this.namespaces[name] = newNs; // Keep track of the ns just in case
    }

    onClientConnect(socket) {
        console.log('Client connected');
        socket.on('boardUpdate', (data) => this.boardUpdateReceived(socket, data));
        socket.on('disconnect', () => this.onClientDisconnect(socket));

    }

    boardUpdateReceived(socket, msg) {
        console.log('Received board update:');
        console.log(util.inspect(msg));
        // TODO Something interesting
    }

    onClientDisconnect(socket) {
        console.log('Client disconnected');
    }
}
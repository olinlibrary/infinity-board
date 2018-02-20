import SocketIO from 'socket.io';
import util from 'util';

export default class WebSocketServer {

    constructor(boardManager) {
        this.io = null;
        this.boardManager = boardManager;

        // Register our handler to be called when a board is created
        // if (boardManager) {
        //     boardManager.registerBoardCreationEventHandler(this.registerNewBoard);
        // }

        // Bind the current context to the following functions (weird JS thing)
        this.onClientConnect = this.onClientConnect.bind(this);
        this.boardUpdateReceived = this.boardUpdateReceived.bind(this);
    }

    start(httpServer) {
        this.io = new SocketIO(httpServer);
        console.log(`WebSocket server started successfully.`);
        this.io.on('connection', this.onClientConnect);
    }

    onClientConnect(socket) {
        console.log('Client connected');
        socket.on('createBoard', (msg) => {
            this.boardManager.createBoard(msg.name).then((board) => {
                // Let all the connected clients know about the new board
                this.broadcastBoardListUpdate();
                // Send a creation confirmation message to the primary client (should trigger displaying/opening board)
                socket.emit('boardCreated', board.serialize());
            });
        });
        socket.on('boardUpdate', (data) => this.boardUpdateReceived(socket, data));
        socket.on('disconnect', () => this.onClientDisconnect(socket));
    }

    broadcastBoardListUpdate() {
        this.io.emit('boardListUpdate', this.boardManager.getBoardList());
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
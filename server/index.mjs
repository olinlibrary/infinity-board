import dotenv from 'dotenv';
import fs from 'fs';
import HttpServer from './http-server.mjs';
import DatabaseConnection from './database.mjs';
import BoardManager from './board-manager.mjs';
import WebSocketServer from './websocket-server.mjs';

// Try loading environment variables from a .env file
if (fs.existsSync('./.env')) {
    dotenv.config();
}

// Figure out which port we're going to be listening for connections on
const port = process.env.PORT || 1234;

// Start the HTTP server
const httpServer = new HttpServer(port);

// Board manager
let bm = new BoardManager();

// Start the WebSockets server
const wsServer = new WebSocketServer(bm);
wsServer.start(httpServer.getHTTPServer());

// Register the message handlers

wsServer.registerMessageHandler('createBoard', (msg, socket) => {
    bm.createBoard(msg.name).then((board) => {
        // Let all the connected clients know about the new board
        wsServer.broadcastBoardListUpdate(bm.getBoardList());
        // Send a creation confirmation message to the primary client (should trigger displaying/opening board)
        socket.emit('boardCreated', board.serialize());
    });
});

wsServer.registerMessageHandler('boardUpdate', (msg, socket) => {
    bm.receivedBoardUpdate(msg);

    // TODO Get name and changed element info from msg
    wsServer.broadcastBoardUpdate(msg, socket);
});
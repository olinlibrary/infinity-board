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

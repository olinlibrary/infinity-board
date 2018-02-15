import dotenv from 'dotenv';
import fs from 'fs';
import HttpServer from './http-server.mjs';
// import WebSocketServer from './websocket-server.mjs';

// Try loading environment variables from a .env file
if (fs.existsSync('./.env')) {
    dotenv.config();
}

// Figure out which port we're going to be listening for connections on
const port = process.env.PORT || 1234;

// Connect to MongoDB
// const dbConn = new DatabaseConnection();
// dbConn.connect();

// Start the HTTP server
const httpServer = new HttpServer(port);

// Start the WebSockets server
// const wsServer = new WebSocketServer(<pass message handler here>);
// wsServer.start(httpServer.getHTTPServer());

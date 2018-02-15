// This file handles all HTTP requests

import expose from './expose';
import express from 'express';
import http from 'http';
import fs from 'fs';
import indexHTML from '../index.html.mjs';

export default class HttpServer {
    
    constructor(port){
        
        // Current hack with Node and experimental modules
        const fullPath = expose.__dirname.split('/');
        fullPath.pop();
        const rootDir = fullPath.join('/');

        // Start the HTTP server
        this.app = express();
        this.server = http.Server(this.app);

        // Add headers
        this.app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);

            // Pass to next layer of middleware
            next();
        });

        // this.app.use(express.json);
        this.server.listen(port, () => console.log(`HTTP server listening on port ${port}`));

        // Register the routes
        this.app.get('/', (req, res) => {
            res.send(indexHTML);
        });
        this.app.get('/bundle.js', (req, res) => {
            res.sendFile(rootDir + '/bundle.js')
        });
    }
    
    getHTTPServer() {
        return this.server;
    }

    getExpressApp() {
        return this.app;
    }
    
}

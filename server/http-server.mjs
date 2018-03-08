// This file handles all HTTP requests

import express from 'express';
import http from 'http';
import S3Router from 'react-s3-uploader/s3router';
import expose from './expose';
import indexHTML from '../index.html.mjs';

/**
 * An HTTP server using Express.
 */
export default class HttpServer {
  /**
   * Starts a new Exxpress HTTP server.
   * @param {number} port - the port to listen for requests on
   */
  constructor(port) {
    // Current hack with Node and experimental modules
    // eslint-disable-next-line no-underscore-dangle
    const fullPath = expose.__dirname.split('/');
    fullPath.pop();
    const rootDir = fullPath.join('/');

    // Start the HTTP server
    this.app = express();
    this.server = http.Server(this.app);

    // Add headers
    this.app.use((req, res, next) => {
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
      res.sendFile(`${rootDir}/bundle.js`);
    });

    // For Amazon S3 uploads
    this.app.use('/s3', S3Router({
      bucket: process.env.AWS_S3_BUCKET_NAME,
      headers: { 'Access-Control-Allow-Origin': '*' },
      ACL: 'private', // this is default
      uniquePrefix: true,
    }));
  }

  /**
   * Gets a reference to the actual HTTP server object.
   * @return {http.Server} the server
   */
  getHTTPServer() {
    return this.server;
  }

  /**
   * Gets a reference to the Express app object.
   * @return {express} the Express app
   */
  getExpressApp() {
    return this.app;
  }
}

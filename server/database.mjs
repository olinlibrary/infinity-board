/* eslint-disable no-underscore-dangle */
// This file is responsible for connecting to and interacting with the MongoDB database.

import MongoClient from 'mongodb';
import Names from './names.mjs';

// eslint-disable-next-line prefer-destructuring
const ObjectId = MongoClient.connect.ObjectId;

export default class DatabaseConnection {
  /**
   * Instantiates an object for communicating with a MongoDB database. Call connect() to
   * actually open a connection to the database.
   */
  constructor() {
    this.connected = false;
    this.db = null;
  }

  /**
   * Opens a new connection to the MongoDB database.
   * @return {Promise<any>} a Promise that resolves once the connection has been established,
   * passing along a connection to the database as the result, if successful.
   */
  connect() {
    return new Promise((resolve, reject) => {
      // Connect to the MongoDB database
      const username = process.env.MONGO_USERNAME;
      const password = process.env.MONGO_PASSWORD;
      const mongoPort = process.env.MONGO_PORT;
      const cluster1 = process.env.MONGO_CLUSTER1;
      const cluster2 = process.env.MONGO_CLUSTER2;
      const cluster3 = process.env.MONGO_CLUSTER3;
      const dbName = process.env.MONGO_DB_NAME;
      const replicaSet = process.env.MONGO_REPLICA_SET;
      const authSource = process.env.MONGO_AUTH_SOURCE || 'admin';

      // Check to make sure we have the information we need to connect
      if (!(username && password && cluster1 && cluster2 && cluster3 && dbName && replicaSet)) {
        // Couldn't find environment variables
        console.error('Please check your environment variables to make sure the following are defined:');
        console.error('\t- MONGO_USERNAME');
        console.error('\t- MONGO_PASSWORD');
        console.error('\t- MONGO_PORT');
        console.error('\t- MONGO_CLUSTER1');
        console.error('\t- MONGO_CLUSTER2');
        console.error('\t- MONGO_CLUSTER3');
        console.error('\t- MONGO_DB_NAME');
        console.error('\t- MONGO_REPLICA_SET');
        console.error('Connection to MongoDB failed.');
        reject(Error('Connection to MongoDB failed. Required environment variables not defined.'));
      } else {
        // We have all the information we need to connect, so attempt to do so
        const mongoUri = `mongodb://${username}:${password}@${cluster1}:${mongoPort},${cluster2}:${mongoPort},${cluster3}:${mongoPort}/${dbName}?ssl=true&replicaSet=${replicaSet}&authSource=${authSource}`;

        MongoClient.connect(mongoUri, (err, client) => {
          if (!err) {
            console.log('Successfully connected to MongoDB instance.');
            this.db = client.db(dbName);
            this.connected = true;
            this.db.on('close', () => {
              console.log('Lost connection to MongoDB instance. Attempting to reconnect...');
              this.connected = false;
            });
            this.db.on('reconnect', () => {
              console.log('Successfully reconnected to MongoDB instance.');
              this.connected = true;
            });
            resolve(this.db);
          } else {
            console.error(err);
            console.error('Error connecting to MongoDB instance.');
            reject(err);
          }
        });
      }
    });
  }

  /**
     * Check to see if we are currently connected to the database.
     * @return {boolean} whether or not a connection to the database is currently open
     */
  isConnected() {
    return this.connected;
  }

  /**
   * Creates a new board in the database.
   * @param {string} name - (optional) the desired name for the board.
   * If one is not specified, one will be generated.
   * @return {Promise<any>} a Promise that resolves when the board has been created.
   */
  createBoard(name) {
    return new Promise((resolve, reject) => {
      const now = new Date();
      if (!name) {
        name = Names.toName(now.getTime());
      }
      const obj = {
        created: now, lastUsed: now, name, elements: [],
      };
      this.db.collection('boards').insertOne(obj, (err, res) => {
        if (err) {
          reject(err);
        } else {
          // Resolve with the new db entry
          resolve(res.ops[0]);
        }
      });
    });
  }

  /**
   * Updates the "last used" time of the board (to enable sorting by last opened/used).
   * Only one parameter should be specified.
   * @param {string} name - the name of the board
   * @param {number} id - the unique ID of the board
   */
  updateBoardLastUsed(name = null, id = null) {
    const now = new Date();
    const query = {};
    if (name) {
      query.name = name;
    } else if (id) {
      query._id = ObjectId(id);
    } else {
      throw Error('Both parameters "name" and "id" must not be null');
    }
    const updatedVals = { $set: { lastUsed: now } };
    this.db.collection('boards').updateOne(query, updatedVals, (err, res) => {
      if (err) throw err;
    });
  }

  /**
   * Saves a board to the database (creation or update).
   * @param {Board} board - a full Board object.
   */
  saveBoard(board) {
    const query = { _id: board._id };
    const updatedVals = { $set: { elements: board.elements } };
    return this.db.collection('boards').updateOne(query, updatedVals, (err, res) => {
      if (err) throw err;
    });
  }

  /**
   * Gets all the information for a given board. Only one parameter should be specified.
   * @param {string} name - the name of the board
   * @param {number|null} id - the ID of the board
   * @return {Promise<any>} a Promise that resolves once the data has been fetched, passing on
   * the data on as the result.
   */
  getBoard(name = null, id = null) {
    return new Promise((resolve, reject) => {
      const query = {};
      if (name) {
        query.name = name;
      } else if (id) {
        query._id = ObjectId(id);
      } else {
        reject(Error('Both parameters "name" and "id" must not be null'));
      }
      resolve(this.db.collection('boards').findOne(query));
    });
  }

  /**
   * Gets a list of all the boards in the database.
   * @return {Promise} a Promise that resolves to a list of all the boards in the database.
   */
  listBoards() {
    return this.db.collection('boards').find({}).toArray();
  }
}

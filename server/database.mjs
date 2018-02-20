// This file is responsible for connecting to and interacting with the MongoDB database.

import MongoClient from 'mongodb';
import Names from './names.mjs';
export default class DatabaseConnection {

    constructor() {

        this.connected = false;
        this.db = null;

    }

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
                reject('Connection to MongoDB failed. Required environment variables not defined.');
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
                        this.createBoard((board) => {
                            this.updateBoardLastUsed(null, board._id);
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

    createBoard(name) {
        return new Promise((resolve, reject) => {
            let now = new Date();
            if (!name){
                name = Names.toName(now.getTime());
            }
            let obj = {'created': now, 'lastUsed': now, 'name': name};
            this.db.collection("boards").insertOne(obj, function(err, res){
                if (err) {
                    reject(err);
                } else {
                    // Resolve with the new db entry
                    resolve(res.ops[0]);
                }
            });
        });
    }

    updateBoardLastUsed(name=null,id=null) {
	var now = new Date();
	var query = {};
	if(name){
	    query.name = name;
	}else if(id){
	    query._id = id;
	}else{

	}
	var updatedVals = {$set: {'lastUsed':now}};
	this.db.collection("boards").updateOne(query, updatedVals, function(err, res){
	    if(err) throw err;
	});
    }

    listBoards() {
	return this.db.collection("boards").find();
    }
}

import Board from './board.mjs';
import DatabaseConnection from "./database.mjs";

export default class BoardManager {

    constructor() {
        this.boards = {};
        this.boardListUpdateEventHandlers = [];
        this.dbConn = new DatabaseConnection();
        this.dbConn.connect();

        // Bind contexts
        this.getBoardList = this.getBoardList.bind(this);
    }

    createBoard(name=null) {

        return new Promise((resolve, reject) => {
            this.dbConn.createBoard(name).then((boardDbObj) => {
                // Instantiate a Board object
                let board = new Board(boardDbObj);

                // Save the board to our list of open boards
                this.boards[board.getName()] = board;

                // Register this board with the WebSockets server (or anything else that wants to be notified of board creation)
                this.boardListUpdateEventHandlers.forEach(handler => handler());

                resolve(board);
            }, (err) => {
                reject(err);
            });
        });

    }

    getBoardList() {
        return Object.values(this.boards).map((board) => {
            return {
                name: board.getName(),
                id: board.getId(),
                created: board.getCreatedTime(),
                lastUsed: board.getLastUsedTime(),
            }
        })
    }

    registerBoardCreationEventHandler(handler) {
        this.boardListUpdateEventHandlers.push(handler);
    }

}
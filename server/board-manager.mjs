import Board from './board.mjs';

export default class BoardManager {

    constructor() {
        this.boards = {};
        this.boardCreationEventHandlers = [];
    }

    generateNewBoard(name=null) {
        // If a board name was not specified, generate a random one
        if (!name) {
            // Generate a random name between "board0" and "board999999999"
            name = 'board' + Math.floor(Math.random() * 999999999);
        }

        // Instantiate a Board object
        let board = new Board(name);

        // Save the board to our list of open boards
        this.boards[name] = board;

        // Register this board with the WebSockets server (or anything else that wants to be notified of board creation)
        this.boardCreationEventHandlers.forEach(handler => handler(board));
    }

    registerBoardCreationEventHandler(handler) {
        this.boardCreationEventHandlers.push(handler);
    }

}
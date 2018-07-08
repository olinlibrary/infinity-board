import SocketIO from 'socket.io-client';
import { BoardActionTypes } from './data/board-actions';

/**
 * Enables communication with the InfinityBoard backend server, handling all data transfers.
 */
export default class ServerComm {
  constructor(serverURL) {
    this.comm = SocketIO(serverURL);
    // this.comm.connect();
  }

  broadcastMessage = (action) => {
    this.comm.emit(action.type, { boardName: '1234', originatingSocket: this.comm.id, ...action })
  };

  initializeSocket = (store) => {
    Object.keys(BoardActionTypes).forEach(type =>
      this.comm.on(type, (payload) => {
        console.log(type)
        store.dispatch({ type, ...payload });
      }))
  }


  socketEmit = store => next => (action) => {
    if (!('originatingSocket' in action)) {
      this.broadcastMessage(action)
    }
    next(action);
  }
}

/* eslint-disable */
import SocketIO from 'socket.io-client';
import ReactDOM from 'react-dom';
import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import Board from './board/board';
import './App.css';
import BoardList from './board-list';
import ServerComm from './server-comm';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import defaultReducer from './data/reducers';
import BoardContainer from './containers/BoardContainer';
import BoardWindowContainer from './containers/BoardWindowContainer';
import { BoardActionTypes } from './data/board-actions'

/**
 * The main React container for the app. It holds the state and passes it down
 * as props to its child components.
 */
class App extends React.Component {
  constructor() {




    super();
    this.state = {
      boards: {},
    };
    this.comm = new ServerComm(window.SERVER_URI);
    this

    // this.serverComm = SocketIO(window.SERVER_URI);
    // this.serverComm.on('SET_CURSOR', () => console.log("nice"))
    // const init = (store) => {
    //   Object.keys(BoardActionTypes).forEach( type =>
    //     this.serverComm.on( type, (payload) => {
    //       // console.log(payload.originatingSocket)
    //       // console.log(type);
    //       // console.log(payload);
    //       store.dispatch({ type, ...payload });
    //     })
    //   )
    // };
    //
    // this.emit = (action) => {
    //   this.serverComm.emit(action.type, {boardName: "1234", originatingSocket: this.serverComm.id, ...action} )};
    //
    // const socketEmit = store => next => action => {
    //   // console.log(action.type)
    //   // console.log(action)
    //
    //   if (!("originatingSocket" in action)) {
    //     // console.log(action.originatingSocket)
    //     // console.log(action)
    //     this.emit(action)
    //   }
    //   next(action);
    // }
    //
    this.store = createStore(
      defaultReducer,
      { boardReducer: { boxOrder: [] }},
      applyMiddleware(this.comm.socketEmit)
    );
    this.comm.initializeSocket(this.store);
    // init(this.store)
    // this.serverComm = new ServerComm(window.SERVER_URI);
    // this.serverComm.connect();
  }

  componentDidMount() {
    // this.serverComm.setReceivedBoardListMessageHandler(this.setBoardList);
    // this.serverComm.getBoardList();
  }

  setBoardList = (boards) => {
    this.setState({ boards });
  };

  render() {
    const boardObjects = Object.keys(this.state.boards).map(key => this.state.boards[key]);
    return (
      <BrowserRouter>
        <div className="app">
          <Switch>
            {/* <Route
              exact
              path="/"
              render={({ history }) => (
                <BoardList
                  boards={boardObjects}
                  serverComm={this.serverComm}
                  history={history}
                  createBoard={this.createBoard}
                />
              )}
            /> */}
            <Route
              path="/"
              component={props =>
                <Provider store={this.store}>
                  <BoardWindowContainer>
                    <BoardContainer />
                  </BoardWindowContainer>
                </Provider>
              }
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

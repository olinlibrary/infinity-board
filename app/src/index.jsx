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
    this.store = createStore(
      defaultReducer,
      { boardReducer: { boxOrder: [], }, boardWindowReducer: { mouseMove: false, }},
      // Apply websocket middleware
      applyMiddleware(this.comm.socketEmit)
    );
    // Initialize socket to work with the store
    this.comm.initializeSocket(this.store);
  }

  componentDidMount() {
    this.comm.setReceivedBoardListMessageHandler(this.setBoardList);
    this.comm.getBoardList();
  }

  setBoardList = (boards) => {
    this.setState({ boards });
  };

  setCurBoard = (name) => {
    this.comm.setBoardName(name);
  }

  render() {
    // console.log(this.props.mouseMove)
    const boardObjects = Object.keys(this.state.boards).map(key => this.state.boards[key]);
    return (
      <BrowserRouter>
        <div className="app">
          <Switch>
            <Route
              exact
              path="/"
              render={({ history }) => (
                <BoardList
                  boards={boardObjects}
                  serverComm={this.comm}
                  history={history}
                />
              )}
            />
            <Route
              path="/:boardName"
              component={props =>
                <Provider store={this.store}>
                  <BoardWindowContainer>
                    <BoardContainer
                      boardName={props.match.params.boardName}
                      comm={this.comm}
                      setBoardName={this.setCurBoard}
                    />
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

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
import { createStore } from 'redux';
import board from './data/reducers';
import BoardContainer from './containers/BoardContainer';

/**
 * The main React container for the app. It holds the state and passes it down
 * as props to its child components.
 */
class App extends React.Component {
  constructor() {
    super();
    this.store = createStore(board, preloadedState = { boxOrder: [] })

    this.serverComm = new ServerComm(window.SERVER_URI);
    this.serverComm.connect();
  }

  componentDidMount() {
    this.serverComm.setReceivedBoardListMessageHandler(this.setBoardList);
    this.serverComm.getBoardList();
  }

  setBoardList = (boards) => {
    this.setState({ boards });
  };

  render() {
    return (
      <Provider store={this.store}>
        <BoardContainer />
      </Provider>
    );
    // const boardObjects = Object.keys(this.state.boards).map(key => this.state.boards[key]);
    // return (
    //   <BrowserRouter>
    //     <div className="app">
    //       <Switch>
    //         <Route
    //           exact
    //           path="/"
    //           render={({ history }) => (
    //             <BoardList
    //               boards={boardObjects}
    //               serverComm={this.serverComm}
    //               history={history}
    //               createBoard={this.createBoard}
    //             />
    //           )}
    //         />
    //         <Route
    //           path="/:boardName"
    //           component={props => <Board boardName={props.match.params.boardName} />}
    //         />
    //       </Switch>
    //     </div>
    //   </BrowserRouter>
    // );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

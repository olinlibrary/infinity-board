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

/**
 * The main React container for the app. It holds the state and passes it down
 * as props to its child components.
 */
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      boards: {},
      currentBoardData: null,
    };

    this.serverComm = new ServerComm(window.SERVER_URI);
    this.serverComm.connect();
  }

  componentDidMount() {
    this.serverComm.setReceivedBoardListMessageHandler(this.setBoardList);
    this.serverComm.setReceivedBoardDataMessageHandler(this.receivedBoardData);
    this.serverComm.getBoardList();
  }

  setBoardList = (boards) => {
    this.setState({ boards });
  };

  receivedBoardData = (board) => {
    this.setState({ currentBoardData: board });
  };

  createBoard = () => {
    if (this.serverComm) {
      this.serverComm.createBoard();
    }
  };

  render() {
    const boardObjects = Object.keys(this.state.boards).map(key => this.state.boards[key]);
    return (
      <BrowserRouter>
        <div className="app">
          <Switch>
            <Route
              exact
              path="/"
              component={() => (
                <BoardList
                  boards={boardObjects}
                  boardSelected={uuid => this.serverComm.getBoardData(uuid)}
                  createBoard={this.createBoard}
                />
              )}
            />
            <Route
              path="/:boardName"
              component={props => (
                <Board
                  data={this.state.currentBoardData}
                  getBoardData={this.serverComm.getBoardData}
                  boardName={props.match.params.boardName}
                />
              )}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

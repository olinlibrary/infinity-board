import ReactDOM from 'react-dom';
import React from 'react';
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
  }

  componentDidMount() {
    this.serverComm = new ServerComm(window.SERVER_URI);
    this.serverComm.connect();
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

  render() {
    // Also consider the following in order to remove duplicate retrievals from
    // this.state, although this is a judgement call on whether it's worth the
    // extra variables:
    const { boards, currentBoardData } = this.state;
    const boardObjects = Object.keys(boards).map(key => boards[key]);
    const content = currentBoardData
      ? <Board data={currentBoardData} />
      : (
        <BoardList
          boards={boardObjects}
          boardSelected={uuid => this.serverComm.getBoardData(uuid)}
        />
      );

      // Now show it
    return (
      <div className="app">
        {content}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

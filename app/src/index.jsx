import ReactDOM from 'react-dom';
import React from 'react';
import Board from './board/board';
import './App.css';
import BoardList from './board-list';
import ServerComm from './server-comm';

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
    const content = this.state.currentBoardData
      ? <Board data={this.state.currentBoardData} />
      : (
        <BoardList
          boards={Object.values(this.state.boards)}
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

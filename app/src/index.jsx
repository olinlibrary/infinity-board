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
      currentBoardId: null,
    };
  }

  componentDidMount() {
    this.io = new ServerComm(window.SERVER_URI);
    this.io.connect();
    this.io.setReceivedBoardListMessageHandler(this.setBoardList);
    this.io.getBoardList();
  }

  setBoardList = (boards) => {
    this.setState({ boards });
  };

  setCurrentBoardId = (id) => {
    this.setState({
      currentBoardId: id,
    });
  };

  boardSelected = (uuid) => {
    this.setState({ currentBoardId: uuid });
  };

  render() {
    // Figure out what should be shown
    const boardObjects = Object.keys(this.state.boards).map((key) => { return this.state.boards[key]; });

    const content = this.state.currentBoardId
      ? <Board data={this.state.boards[this.state.currentBoardId]} />
      : <BoardList boards={boardObjects} boardSelected={this.boardSelected} />;

      // Now show it
    return (
      <div className="app">
        {content}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

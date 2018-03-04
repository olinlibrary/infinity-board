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

  receivedBoardData = (board) => {
    this.setState({ currentBoardData: board });
  };

  render() {
    // Figure out what should be shown
    const content = this.state.currentBoardId
      ? <Board data={this.state.currentBoardData} />
      : (
        <BoardList
          boards={Object.values(this.state.boards)}
          boardSelected={uuid => this.io.getBoardData(uuid)}
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

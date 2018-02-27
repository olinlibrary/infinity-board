import ReactDOM from 'react-dom';
import React from 'react';
import Board from './board/board';
import './App.css';
import BoardList from './board-list';
import ServerComm from "./server-comm";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      mode: 'list',
      boards: {},
      currentBoardId: null,
    };
  }

  componentDidMount() {
    this.serverComm = new ServerComm(window.SERVER_URI);
    this.serverComm.connect().then((socket) => {
      // Request a list of all the boards
      socket.emit('getBoardList');
    });
  }

  setBoardList = (boards) => {
    this.setState({ boards });
  };

  setCurrentBoardId = (id) => {
    this.setState({
      // currentBoardId: id,
      mode: id ? 'board' : 'list',
    });
  };

  render() {
    // Figure out what should be shown
    const content = this.state.mode === 'list'
      ? <BoardList />
      : <Board />;

      // Now show it
    return (
      <div className="app">
        {content}
      </div>
    );
  }
}

ReactDOM.render(<Board />, document.getElementById('root'));

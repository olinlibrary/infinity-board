import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class BoardList extends React.Component {

  /**
   * Handles the pressing of the create board button.
  */
  createBoard = () => {
    if (this.props.serverComm) {
      this.props.serverComm.setReceivedBoardDataMessageHandler(this.receivedBoardData);
      this.props.serverComm.createBoard();
    }
  };

  receivedBoardData = (board) => {
    this.props.history.push(`/${board.name}`);
  };

  render() {
    const boards = [];
    this.props.boards.forEach((board) => {
      /* eslint-disable */
      boards.push(<Link
        className="board-li"
        onClick={ () => this.boardSelected(board._id) }
        to={{ pathname: `/${board.name}` }}
        key={ board._id }>
        { board.name }
      </Link>);
    });
    return (
      <div className="board-list-super-container">
        <div className="board-list-container">
          <div className="board-list-header">
            <span>InfinityBoard</span>
          </div>
          <div className="add-button" onClick={this.createBoard}>
            +
          </div>
          <div className="board-list">
            {boards}
          </div>
        </div>
      </div>
    );
  }
}

BoardList.propTypes = {
  // TODO Use PropTypes.arrayOf(Board)
  // eslint-disable-next-line react/forbid-prop-types
  boards: PropTypes.array.isRequired,
  history: PropTypes.func.isRequired,
  serverComm: PropTypes.object.isRequired,
  createBoard: PropTypes.func.isRequired,
};

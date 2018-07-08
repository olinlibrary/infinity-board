/* eslint-disable jsx-a11y/anchor-is-valid,no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class BoardList extends React.Component {
  onAddButtonKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      this.createBoard();
    }
  };

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
      boards.push((
        <Link
          className="board-li"
          to={{ pathname: `/${board.name}` }}
          key={board._id}
        >
          { board.name }
        </Link>
      ));
    });
    return (
      <div className="board-list-super-container">
        <div className="board-list-container">
          <div className="board-list-header">
            <span>InfinityBoard</span>
          </div>
          <div className="add-button" onClick={this.createBoard} onKeyDown={this.onAddButtonKeyDown}>
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
  // eslint-disable-next-line react/forbid-prop-types
  boards: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  serverComm: PropTypes.object.isRequired,
};

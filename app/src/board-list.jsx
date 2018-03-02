import React from 'react';
import PropTypes from 'prop-types';

export default class BoardList extends React.Component {

  render() {
    const boards = [];
    this.props.boards.forEach((board) => {
      boards.push(<button className="board-li" onClick={() => this.props.boardSelected(board._id)} key={board.id}>{board.name}</button>);
    });
    return (
      <div className="board-list">
        {boards}
      </div>
    );
  }
}

BoardList.propTypes = {
  // TODO Use PropTypes.arrayOf(Board)
  // eslint-disable-next-line react/forbid-prop-types
  boards: PropTypes.array.isRequired,
  boardSelected: PropTypes.func.isRequired,
};

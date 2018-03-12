import React from 'react';
import PropTypes from 'prop-types';

export default class BoardList extends React.Component {
  render() {
    const boards = [];
    this.props.boards.forEach((board) => {
      /* eslint-disable */
      boards.push(<div
        className="board-li"
        onClick={ () => this.props.boardSelected(board._id) }
        key={ board._id }>
        { board.name }
      </div>);
      /* eslint-enable */
    });
    return (
      <div className="board-list-super-container">
        <div className="board-list-container">
          <div className="board-list-header">
            <span>InfinityBoard</span>
          </div>
          <div className="add-button" onClick={this.props.createBoard}>
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
  boardSelected: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired,
};

import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import uuidv4 from 'uuid/v4';
import '../App.css';
import ServerComm from '.././server-comm';
import Box from './box'


class Board extends React.Component {


  // Avoids unnecessary calls to setCurDragging, which improves performance
  setDragging = (uuid) => {
    if (uuid !== this.props.curDragging) {
      this.props.setCurDragging(uuid)
    }
  }

  // Creates a new box
  generateBox = () => {
    this.props.generateBox(uuidv4(), randomColor());
  }

  render() {
    // console.log(this.props.boxes)
    // console.log(this.props.boxes)
    const allKeys = this.props.boxOrder;
    console.log(allKeys)
    const boxes = [];
    for (let i = 0; i < allKeys.length; i++) {
      const curKey = allKeys[i];
      const boxProps = this.props.boxes[curKey];

      boxes.push(<Box
        key={curKey}
        uuid={curKey}
        cursor={this.props.cursor}
        setMouseDown={this.props.setMouseDown}
        moveCallback={this.props.moveCallback}
        clickCallback={this.props.clickCallback}
        setCurDragging={this.setDragging}
        resizeCallback={this.props.resizeCallback}
        cursorCallback={this.props.cursorCallback}
        visibilityCallback={this.props.visibilityCallback}
        {...boxProps}
      />);
    };
    // console.log(boxes)
    // const buttonStyle = { zIndex: this.state.zIndex + 2 };
    const buttonStyle = { zIndex: 1 };
    return (
      // eslint-disable-next-line
      <div>
        {boxes}
      </div>
    );
  }
}

Board.propTypes = {
  // eslint-disable-next-line
  boxes: PropTypes.object,
  cursor: PropTypes.string,
  generateBox: PropTypes.func.isRequired,
  setMouseDown: PropTypes.func.isRequired,
  moveCallback: PropTypes.func.isRequired,
  clickCallback: PropTypes.func.isRequired,
  cursorCallback: PropTypes.func.isRequired,
  visibilityCallback: PropTypes.func.isRequired,
  setCurDragging: PropTypes.func.isRequired,
  // eslint-disable-next-line
  boxOrder: PropTypes.array.isRequired,
};

Board.defaultProps = {
  cursor: 'move',
  boxes: {},
}

export default Board;

import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import ReactS3Uploader from 'react-s3-uploader';
import uuidv4 from 'uuid/v4';
import '../App.css';
import ServerComm from '.././server-comm';
import Box from './box'


class Board extends React.Component {
  constructor(props) {
    super(props);
  };

  generateBox = () => {
    this.props.generateBox(uuidv4(), randomColor());
  }

  render() {
    // console.log(this.props.boxes)
    const bgStyle = { // Set the position for the grid background
      // eslint-disable-next-line
      // backgroundPosition: String(this.state.windowX % 50) + 'px ' +  String(this.state.windowY % 50) + 'px',
    };
    // console.log(this.props.boxes)
    const allKeys = Object.keys(this.props.boxes);
    // console.log(allKeys)
    const boxes = [];
    for (let i = 0; i < allKeys.length; i++) {
      const curKey = allKeys[i];
      const boxProps = this.props.boxes[curKey];

      // If box is being dragged, make its z-index higher
      if (curKey === this.props.curDragging) {
        boxProps.zIndex = 2;
      } else {
        boxProps.zIndex = 1;
      }

      boxes.push(<Box
        key={curKey}
        uuid={curKey}
        cursor={this.props.cursor}
        setMouseDown={this.props.setMouseDown}
        moveCallback={this.props.moveCallback}
        clickCallback={this.props.clickCallback}
        setCurDragging={this.props.setCurDragging}
        resizeCallback={this.props.resizeCallback}
        cursorCallback ={this.props.cursorCallback}
        visibilityCallback={this.props.visibilityCallback}
        {...boxProps}
      />);
    };
    // console.log(boxes)
    // const buttonStyle = { zIndex: this.state.zIndex + 2 };
    const buttonStyle = { zIndex: 1 };
    return (
      // eslint-disable-next-line
      <div className="View" state={{ cursor: this.props.cursor }}>
        {boxes}
        <div className="View" style={bgStyle} id="bg" ref={(view) => { this.view = view; }} />
        <div className="Button-wrapper" style={buttonStyle}>
          <div className="Box-button">
            <button className="Box-button" onClick={this.generateBox}>
              <i className="fa fa-home" />
            </button>
          </div>
        </div>
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
};

Board.defaultProps = {
  cursor: 'move',
  boxes: {},
}

export default Board;

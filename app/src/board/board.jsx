import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import ReactS3Uploader from 'react-s3-uploader';
import uuidv4 from 'uuid/v4';
import '../App.css';
import ServerComm from '.././server-comm';
import TextBox from './text-box';
import ImageBox from './image-box';


class Board extends React.Component {
  constructor(props) {
    super(props);
  };

  generateBox = () => {
    this.props.createBox(uuidv4());
  }

  render() {
    const allKeys = Object.keys(this.props.boxes);
    const boxes = [];
    for (let i = 0; i < this.props.boxes.length; i++) {
      const curKey = allKeys[i];
      const boxProps = this.state.boxes[curKey];

      boxes.push(<Box
        uuid = { curKey }
        setMouseDown = {this.props.setMouseDown}
        moveCallback = {this.props.moveCallback}
        clickCallback = {this.props.clickCalback}
        {...this.state.boxes[curkey]}
      />);
    }
    return (
      // eslint-disable-next-line
        {/* {clientBoxes} */}
        {boxes}
        <div className="View" style={bgStyle} id="bg" ref={(view) => { this.view = view; }} />
          <div className="Button-wrapper" style={buttonStyle}>
            <div className="Box-button">
              <button className="Box-button" onClick={ this.props.generateBox } >
                <i className="fa fa-home" />
              </button>
            </div>
          {/* <div className="Box-button" style={buttonStyle}>
            <button className="Box-button text" onClick={() => this.handleButtonClick('text')} >
              <i className="fa fa-font" data-type="text" />
            </button>
          </div>
          <div className="Box-button" style={buttonStyle}>
            <button className="Box-button image" onClick={() => this.handleButtonClick('image')} >
              <i className="fa fa-image" />
            </button>
          </div> */}
          {/* <div className="Box-button" style={buttonStyle}>
            <button
              className="Box-button trash"
              onMouseEnter={() => this.setState({ onDelete: true })}
              onMouseLeave={() => this.setState({ onDelete: false })}
            >
              <i className="fa fa-trash" />
            </button> */}
          </div>
        </div>
    )
  }
}

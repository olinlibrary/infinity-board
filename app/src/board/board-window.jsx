import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import uuidv4 from 'uuid/v4';
import ReactS3Uploader from 'react-s3-uploader';

class BoardWindow extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  /**
   * Called once the component has rendered on the screen.
   */
  componentDidMount() {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
    // window.addEventListener('beforeunload', (e) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   this.io.sendClientUpdate({
    //     client: this.uuid,
    //     x: 0,
    //     y: 0,
    //     color: 'transparent',
    //   });
    // });
    // this.io.getBoardData(null, this.props.boardName);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.mouseDown);
    document.removeEventListener('mousemove', this.mouseMove);
  }

  /**
   * On finishing upload of an image, create a box containing that image
   * @param e - the upload finish event
  */
  onUploadFinish = (e) => {
    // eslint-disable-next-line
    const imgUrl = e.publicUrl;
    this.generateBox('image', { src: imgUrl });
  };

  getBGStyle = () => {
    return { // Set the position for the grid background
      // eslint-disable-next-line
      backgroundPosition: String(this.props.windowX % 50) + 'px ' +  String(this.props.windowY % 50) + 'px',
    };
  }

  // Creates a new box
  generateBox = (boxType, optionalArgs = {}) => {
    // console.log(optionalArgs)
    this.props.generateBox(uuidv4(), randomColor(), boxType, optionalArgs);
  }

  /**
  * Handles the clicking of the box generation buttons.
  */
  handleButtonClick = (boxType) => {
    if (boxType === 'image') {
      // If running locally, mock the image box creation
      if (LOCALDEV) {
        this.generateBox(boxType, { src: "../../../favicon.png", isUpload: false })
      } else {
        this.input.click(); // Manually bring up file dialog
      }
    } else if (boxType === 'text') {
      this.generateBox(boxType, { text: '', editing: false });
    }
  };

  /**
   * Handles the movement of the board view window.
  */
  dragWindow = (e) => {
    if (this.props.windowDrag) {
      const curX = this.props.windowX;
      const curY = this.props.windowY;
      this.props.setWindowPos(
        curX + (e.clientX - this.props.prevX),
        curY + (e.clientY - this.props.prevY),
      );
      this.props.setPrevWindowPosition(
        e.clientX,
        e.clientY,
      );
      // this.io.sendClientUpdate({
      //   client: this.uuid,
      //   x: this.state.windowX - (window.innerWidth / 2),
      //   y: this.state.windowY - (window.innerHeight / 2),
      //   color: this.state.clientColor,
      // });
    }
  };


  /**
   * Updates the board state to allow window movement on mouse press.
  */
  mouseDown = (e) => {
    // Only drag on middle mouse, or when not over a box
    if (e.button === 1 || e.target === this.view) {
      this.props.setWindowDrag(true);
      this.props.setPrevWindowPosition(e.clientX, e.clientY);
      this.props.setCursor('move');
    }
    this.props.setMouseMove(false);
  };

  mouseMove = () => {
    this.props.setMouseMove(true);
  }

  /**
   * Stops movement of the board window.
  */
  mouseUp = () => {
    this.props.setWindowDrag(false);
    this.props.setCursor('default');
  };


  render() {
    // console.log(this.props.overDelete)
    return (
      // eslint-disable-next-line
      <div className="View"
        onMouseMove={this.dragWindow}
        onMouseUp={this.mouseUp}
        style={{ cursor: this.props.cursor }}
      >
        <div>
          {this.props.children}
        </div>
        <div className="View" style={this.getBGStyle()} id="bg" ref={(view) => { this.view = view; }} />
        <div className="Button-wrapper">
          <div className="Box-button">
            <button className="Box-button" onClick={() => { this.props.setWindowPos(0, 0); }}>
              <i className="fa fa-home" />
            </button>
          </div>
          <div className="Box-button">
            <button className="Box-button text" onClick={() => this.handleButtonClick('text')} >
              <i className="fa fa-font" data-type="text" />
            </button>
          </div>
          <div className="Box-button">
            <button className="Box-button image" onClick={() => this.handleButtonClick('image')} >
              <i className="fa fa-image" />
            </button>

            <ReactS3Uploader
              signingUrl="/s3/sign"
              signingUrlMethod="GET"
              accept="image/*"
              onFinish={this.onUploadFinish}
              uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }} // this is the default
              inputRef={(input) => { this.input = input; }}
              style={{ display: 'none' }}
            />
          </div>
          <div className="Box-button" style={{ zIndex: 6 }}>
            <button
              className="Box-button trash"
              onMouseEnter={() => this.props.setOverDelete(true)}
              onMouseLeave={() => this.props.setOverDelete(false)}
            >
              <i className="fa fa-trash" />
            </button>
          </div>
        </div>

      </div>
    )
  }
}

BoardWindow.propTypes = {
  // Callback props
  // eslint-disable-next-line
  setWindowDrag: PropTypes.func.isRequired,
  setPrevWindowPosition: PropTypes.func.isRequired,
  setCursor: PropTypes.func.isRequired,
  setWindowPos: PropTypes.func.isRequired,
  generateBox: PropTypes.func.isRequired,
  setOverDelete: PropTypes.func.isRequired,

  // State props
  windowDrag: PropTypes.bool,
  windowX: PropTypes.number,
  windowY: PropTypes.number,
  prevX: PropTypes.number,
  prevY: PropTypes.number,
  cursor: PropTypes.string,
};

BoardWindow.defaultProps = {
  windowDrag: false,
  windowX: 0,
  windowY: 0,
  prevX: 0,
  prevY: 0,
  cursor: 'default',
}


export default BoardWindow;

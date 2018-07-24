import React from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import uuidv4 from 'uuid/v4';
import ReactS3Uploader from 'react-s3-uploader';

class BoardWindow extends React.Component {

  /**
   * Called once the component has rendered on the screen.
   */
  componentDidMount() {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
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
    let imgUrl = e.publicUrl;
    // eslint-disable-next-line
    if (LOCALDEV) {
      // If localdev, change the src for the image box
      imgUrl = 'http://localhost:1234'.concat(imgUrl);
    }
    this.generateBox('image', { src: imgUrl, key: e.fileKey });
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
      this.input.click(); // Manually bring up file dialog
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
        window.innerWidth,
        window.innerHeight,
      );
      this.props.setPrevWindowPosition(
        e.clientX,
        e.clientY,
      );
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
    // Render clients
    const allClients = Object.keys(this.props.clients);
    const clientBoxes = [];
    for (let i = 0; i < allClients.length; i++) {
      const curKey = allClients[i];
      if (curKey !== this.uuid) {
        const xVal = -this.props.clients[curKey].x + this.props.windowX;
        const yVal = -this.props.clients[curKey].y + this.props.windowY;
        const clientStyle = ({
          left: xVal,
          top: yVal,
          zIndex: 3,
          backgroundColor: this.props.clients[curKey].color,
        });
        clientBoxes.push(<div className="Client-box" key={curKey} style={clientStyle} />);
      }
    }

    // If localdev, make changes to signing url
    let signUrl = '/s3/sign';
    // eslint-disable-next-line
    if (LOCALDEV) {
      signUrl = 'http://localhost:1234'.concat(signUrl);
    }

    return (
      // eslint-disable-next-line
      <div className="View"
        onMouseMove={this.dragWindow}
        onMouseUp={this.mouseUp}
        style={{ cursor: this.props.cursor }}
      >
        <div>
          {clientBoxes}
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
              signingUrl={signUrl}
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
  // eslint-disable-next-line
  clients: PropTypes.object,
};

BoardWindow.defaultProps = {
  windowDrag: false,
  windowX: 0,
  windowY: 0,
  prevX: 0,
  prevY: 0,
  cursor: 'default',
  clients: {},
}


export default BoardWindow;

import React from 'react';
import randomColor from 'randomcolor';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import '../App.css';
import ServerComm from '.././server-comm';
import TextBox from './text-box';
import ImageBox from './image-box';


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.serverComm = new ServerComm(window.SERVER_URI);
    this.serverComm.setReceivedUpdateMessageHandler(this.onUpdate);
    this.serverComm.connect();
    this.state = {
      windowX: 0,
      windowY: 0,
      prevX: 0,
      prevY: 0,
      name: props.name,
      zIndex: 1,
      boxes: {},
      dragOverState: {
        visibility: 'hidden',
        zIndex: -1,
      },
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpdateDup = this.onUpdateDup.bind(this);
  }

  componentDidMount() {
    document.addEventListener('drop', this.handleFileDrop);
    document.addEventListener('dragover', this.dragOverHandler);
    document.addEventListener('dragleave', this.dragLeaveHandler);
    // document.addEventListener('mousedown', this.dragWindow);
    // document.addEventListener('mousemove', this.mouseMove);
    // document.addEventListener('mouseup', this.mouseUp);
  }

  /*
  Handles when a file is selected from the file selection dialog.
  */
  onFileSelect = (e) => {
    e.preventDefault();
    this.generateBox('image');
  };


  /*
  Update the state for a given board based on a message from the websocket.
  @params msg: the websocket message containing updated state data for the board.
  */
  onUpdate = (msg) => {
    this.onUpdateDup(msg);
  };

  // TODO Figure out why this redundant/nested call is necessary to get access to 'this'
  onUpdateDup = (msg) => {
    const updatedState = Object.assign({}, this.state.boxes, {
      [msg.uuid]: Object.assign({}, this.state.boxes[msg.uuid], {
        state: msg.state,
        type: msg.type,
      }),
    }); // TODO: Seems redundant from updateBoardState, should change
    // updatedState[msg.uuid].state = msg.state; // Doing this is necessary to index by UUID
    this.setState({
      boxes: updatedState,
    });
  };

  /*
  Update the state for a given board based on a mouse event.
  @params uuidVal: the UUID of the board.
  @params curState: The state object for the board..
  */
  updateBoardState = (uuidVal, newState) => {
    const origState = Object.assign({}, this.state.boxes);
    const updatedState = Object.assign( // Update just the state elements we care about
      {},
      origState[uuidVal].state,
      newState,
    ); // Doing this is necessary to index by UUID
    origState[uuidVal].state = updatedState;
    this.setState({
      boxes: origState,
    });
    // Push the update out over WebSockets
    this.serverComm.sendUpdateMessage({
      uuid: uuidVal,
      state: updatedState,
      type: origState[uuidVal].type,
    });
  };

  /*
  Increments the highest z-index for the board.
  @return zIndex, the current board z-index
  */
  updateZ = () => {
    this.setState({
      zIndex: this.state.zIndex + 1,
    });
    return this.state.zIndex;
  };

  updateText = (uuid, text) => {
    this.updateBoardState(uuid, { value: text });
  }

  /*
  Handles the clicking of the box generation buttons.
  */
  handleButtonClick = (e) => {
    const boxType = e.target.dataset.type; // Get the type of box we're making
    if (boxType === 'image') {
      this.fileInput.click();
    } else {
      this.generateBox(boxType);
    }
  };


  /*
  Generates a box based on a button click event.
  @params e: the button click event.
  */
  generateBox = (boxType) => {
    const uuid = uuidv4(); // Gen unique UUID
    const initState = this.state.boxes;
    const stateObject = {
      x: 50,
      y: 50,
      w: 200,
      h: 200,
      z: this.state.zIndex,
      color: randomColor(),
      value: '',
    };

    initState[uuid] = {
      type: boxType,
      state: stateObject,
    };
    this.setState({ boxes: initState });
    this.updateBoardState(uuid, stateObject); // TODO Refactor so that this isn't necessary
  };

  /*
  Generates a box based on a browser file drop event.
  @params e: the file drop event.
  */
  handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.generateBox('image');
    this.dragLeaveHandler(e);
  };

  /*
  Makes the drag over div visible.
  @params e: the file drag event.
  */
  dragOverHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragOverState: {
        opacity: 1,
        zIndex: this.state.zIndex,
      },
    });
  };

  /*
  Makes the drag over div invisible.
  @params e: the file drag leave event.
  */
  dragLeaveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragOverState: {
        opacity: 0,
        zIndex: -1,
      },
    });
  };

  dragWindow = (e) => {
    if (this.state.dragging) {
      const curX = this.state.windowX;
      const curY = this.state.windowY;
      this.setState({
        windowX: curX + (e.clientX - this.state.prevX),
        windowY: curY + (e.clientY - this.state.prevY),
      });
      this.setState({
        prevX: e.clientX,
        prevY: e.clientY,
      });
    }
  }

  mouseDown = (e) => {
    this.setState({
      dragging: true,
      prevX: e.clientX,
      prevY: e.clientY,
      cursor: 'move',
    })
  }

  mouseUp = () => {
    this.setState({ dragging: false, cursor: 'default' })
  }

  /*
  Called on ImageBox load to resize image correctly
  @params uuid: the UUID of the box
  @params w: the new width of the box
  @params h: the new height of the box
  */
  updateImage = (uuid, w, h) => {
    const initState = this.state.boxes;
    initState[uuid].state.w = w;
    initState[uuid].state.h = h;
    initState[uuid].aspect = w / h; // Store the aspect ratio
    this.setState({ boxes: initState });
  };

  render() {
    const allKeys = Object.keys(this.state.boxes);
    const boxes = [];
    for (let i = 0; i < allKeys.length; i++) {
      const key = allKeys[i];
      const propsIn = {
        key: key,
        clickCallback: this.updateZ,
        uid: key,
        x: this.state.boxes[key].state.x,
        y: this.state.boxes[key].state.y,
        renderX: this.state.boxes[key].state.x + this.state.windowX,
        renderY: this.state.boxes[key].state.y + this.state.windowY,
        w: this.state.boxes[key].state.w,
        h: this.state.boxes[key].state.h,
        z: this.state.boxes[key].state.z,
        callback: this.updateBoardState,
        color: this.state.boxes[key].state.color,
        windowX: this.state.windowX,
        windowY: this.state.windowY,
        text: this.state.boxes[key].state.value,
      };
      if (typeof this.state.boxes[key].aspect !== 'undefined') {
        propsIn.aspect = this.state.boxes[key].aspect;
      }

      if (this.state.boxes[key].type === 'text') {
        boxes.push(<TextBox editCallback={this.updateText} {...propsIn} />);
      } else if (this.state.boxes[key].type === 'image') {
        boxes.push(<ImageBox
          src="http://cdn.akc.org/content/hero/puppy-boundaries_header.jpg"
          imgCallback={this.updateImage}
          {...propsIn}
        />);
      }
    }
    // console.log(this.state.zIndex);
    const buttonStyle = { zIndex: this.state.zIndex + 1 };

    return (
      // eslint-disable-next-line
      <div className="View"
        onMouseDown={this.mouseDown}
        onMouseMove={this.dragWindow}
        onMouseUp={this.mouseUp}
        style={{ cursor: this.state.cursor }}
      >
        {boxes}
        <div className="Wrapper View" style={this.state.dragOverState}>
          <div className="Wrapper-text">DROP FILE HERE</div>
        </div>
        <div className="Button-wrapper" style={buttonStyle}>
          <div className="Box-button">
            <button className="Box-button" onClick={() => { this.setState({ windowX: 0, windowY: 0 }); }}>Home</button>
          </div>
          <div className="Box-button">
            <button className="Box-button" data-type="text" onClick={this.handleButtonClick}>Box</button>
          </div>
          <div className="Box-button" style={buttonStyle}>
            <button className="Box-button" data-type="image" onClick={this.handleButtonClick}>Image</button>
            <input type="file" ref={(input) => { this.fileInput = input; }} onChange={this.onFileSelect} style={{ display: 'none' }} />
          </div>
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Board;

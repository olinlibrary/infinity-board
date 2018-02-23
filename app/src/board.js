import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import ServerComm from './server-comm';

const uuidv4 = require('uuid/v4');
var randomColor = require('randomcolor');

class DraggableBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {draggable: false, downX: 0, downY: 0, resizing: false, cursor: 'default', mouseX: 0, mouseY: 0};
  }

  componentDidMount(props, state) {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousemove', this.mouseMove.bind(this));
    document.addEventListener('mouseup', this.mouseUp.bind(this));

  }

  mouseMove(e) {
    this.setState({mouseX: e.clientX, mouseY: e.clientY}) // Fix this, the box should be less state-y
    var id = this.props.uid // Get the UUID of the current board
    if (this.state.resizing) {

      this.props.callback(id, {x: this.props.x, y: this.props.y, w: this.getResize(e.clientX, this.props.x, this.props.minX),
                                h: this.getResize(e.clientY, this.props.y, this.props.minY), color: this.props.color})
    }
    else if (this.state.draggable) {
      // console.log(e.screenX)
      this.props.callback(id, {x: e.screenX + this.state.downX, y: e.screenY + this.state.downY, w: this.props.w, h: this.props.h, color: this.props.color})

      // this.setState({elemX: e.screenX + this.state.downX, elemY: e.screenY + this.state.downY});
    }
  }

  // Gets the new width and height of the box based on the min width and height
  getResize(mouseVal, elemVal, min) {
    var newSize = mouseVal - elemVal
    if (newSize >= min) {
      return newSize;
    }
    else {
      return min;
    }
  }

  mouseDown(e) {
    if (e.button == 0) { // Check to make sure it's left mouse click
      this.setState({downX: this.props.x - e.screenX, downY: this.props.y - e.screenY}); // Update the down mouse X position
      if (this.cursorInDraggingPosition(e)) { //  If we're resizing the box
        this.setState({resizing: true})
      }
      else {
        this.setState({draggable: true})
      }
    }
  }

  mouseUp(e) {
    this.setState({draggable: false, resizing: false});
  }


  cursorInDraggingPosition() {
    var cornerX = Math.pow(this.state.mouseX-this.props.x-this.props.w, 2);
    var cornerY = Math.pow(this.state.mouseY-this.props.y-this.props.h, 2);
    var dist = Math.sqrt(cornerX+cornerY);
    return (dist<20);
  }

  getCursor() {
    if (this.state.draggable) {
      return 'move';
    }
    else if (this.state.resizing || this.cursorInDraggingPosition()) {
      return 'se-resize';
    }
    else {
      return 'default';
    }
  }

  updateStyle(style) {
    this.setState(style);
  }

  getBoxStyle() {
    var boxStyle = {
      backgroundColor: this.props.color,
      left: this.props.x + 'px',
      top: this.props.y + 'px',
      width: this.props.w - 2*this.props.padding + 'px',
      height: this.props.h - 2*this.props.padding + 'px',
      cursor: this.getCursor(),
      padding: this.props.padding + 'px'
    };
    return boxStyle;
  }

  render() {
      return (
        <div onMouseDown={this.mouseDown.bind(this)} className={'Box'} style={this.getBoxStyle()}>
          {this.props.children}
        </div>
      )
  }
}
DraggableBox.defaultProps = {padding: 20, minX: 200, minY: 200, defaultWidth: 200, defaultHeight: 200,
                              x: 0, y: 0,w: 200,h: 200, color: "#ff0000"};

class TextField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: '', editing: false, cursor: 'inherit'};
  }

  onInput(e) {
    this.setState({value: e.target.value})
  }

  onFocus(e) {
    this.setState({editing: true, cursor: 'text'})
  }

  onBlur(e) {
    this.setState({editing: false, cursor: 'inherit'})
  }

  render() {
    var textStyle  = {cursor: this.state.cursor};
    if (this.state.editing) {
      return (<textarea autoFocus="autofocus" value={this.state.value} className={'Text-box unselectable'} onChange = {this.onInput.bind(this)}
                onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} style={textStyle} ></textarea>)
    } else {
      return (<div className={'Text-box unselectable'} onClick = {this.onFocus.bind(this)}>{this.state.value}</div>)
    }
  }
}

class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {width: 0, height: 0, imgStyle: {visibility: "visible"}}
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  onImgLoad({target:img}) {
    this.setState({width: img.offsetWidth, height: img.offsetHeight})
  }

  render() {
    var imgStyle = {
      background: "url(" + this.props.src + ")"
    }
    return (
      <div>

      <DraggableBox padding={0} defaultWidth={this.state.width} defaultHeight={this.state.height}>
        <div className={'Box-image'} style={imgStyle} >
          {this.state.width}{this.state.height}
            <img src={this.props.src} onLoad={this.onImgLoad} style={{visibility: "hidden"}}/>
        </div>
      </DraggableBox>
      </div>
    )
  }
}

class Board extends React.Component {
    constructor(props) {
      super(props);
      // this.socket = new ServerComm("TEST");
      // this.socket.setReceivedUpdateMessageHandler(this.onUpdate);
      this.state = {};

    }

    onUpdate(msg) {
      uuidVal = msg.uuid;
      state = msg.state;
      var updatedState = {} // TODO: Seems redundant from updateBoardState, should change
      updatedState[uuidVal] = state; // Doing this is necessary to index by UUID
      this.setState(updatedState);
    }

    updateBoardState(uuidVal, curState) {
      var updatedState = {}
      updatedState[uuidVal] = curState; // Doing this is necessary to index by UUID
      // this.socket.sendUpdateMessage(uuid: uuidVal, state: curState)
      this.setState(updatedState);
    }

    generateBox() {
      var uuid = uuidv4();
      var initState = {};
      initState[uuid] = {x: 0, y: 0, w: 200, h: 200, color: randomColor()};
      this.setState(initState);
    }

    render() {
      var allKeys = Object.keys(this.state);

      return (
        <div>
        <button onClick={this.generateBox.bind(this)}>Box</button>
          {allKeys.map((key, index) =>
              <DraggableBox uid={key} key={key} x={this.state[key].x} y={this.state[key].y} w={this.state[key].w}
               h={this.state[key].h} callback={this.updateBoardState.bind(this)} color={this.state[key].color}></DraggableBox>
          )}
        </div>
      )
    }
}



export default Board;

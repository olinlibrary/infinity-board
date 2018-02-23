import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import ServerComm from './server-comm';

const uuidv4 = require('uuid/v4');

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
    var id = this.props.uid
    if (this.state.resizing) {

      this.props.callback(id, {w: this.getResize(e.clientX, this.props.x, this.props.minX), h: this.getResize(e.clientY, this.props.y, this.props.minY)})

      // this.setState({xSize: this.getResize(this.state.x, this.state.elemX, this.props.minX),
      //                ySize: this.getResize(this.state.y, this.state.elemY, this.props.minY)})
    }
    else if (this.state.draggable) {
      this.props.callback(id, {x: e.screenX + this.props.x, y: e.screenY + this.props.y})

      // this.setState({elemX: e.screenX + this.state.downX, elemY: e.screenY + this.state.downY});
    }
  }

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
      backgroundColor: 'red',
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

DraggableBox.defaultProps = {
  padding: 20,
  minX: 200,
  minY: 200,
  defaultWidth: 200,
  defaultHeight: 200,
  x: 0,
  y: 0,
  w: 200,
  h: 200
};

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
      this.state = {}

    }

    componentDidMount(props, state) {
      this.generateBox()
    }

    // onUpdate(msg) {
    //
    //
    // }

    updateBoardState(uuid, state) {
      this.state[uuid] = state
    }

    generateBox() {
      var uuid = uuidv4();
      // console.log(uuid)
      this.state[uuid] = {x: 0, y: 0, w: 200, h: 200}
      this.setState({test: "test"})
      // console.log(this.state)
      // console.log(Object.keys(this.state))
    }



    render() {
      // var boxes = []
      // console.log(Object.keys(this.state))
      // for (var val in Object.keys(this.state)) {
      //   console.log(val)
      //   var boxObject = this.state[key];
      //   boxes.push(<DraggableBox key={key} uid={key} x={boxObject.x} y={boxObject.y} w={boxObject.w} h={boxObject.h} callback={this.updateBoardState.bind(this)}></DraggableBox>);
      // }
      // console.log(boxes)
      var allKeys = Object.keys(this.state);
      // console.log(allKeys);
      var test

      return (
          allKeys.map(key =>
              <DraggableBox uid={key} key={key} x={this.state[key].x} y={this.state[key].y} w={this.state[key].w}
               h={this.state[key].h} callback={this.updateBoardState.bind(this)}></DraggableBox>
          )
      )
    }
}



export default Board;

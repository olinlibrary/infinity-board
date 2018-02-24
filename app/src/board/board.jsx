import React from 'react';
import randomColor from 'randomcolor';
import uuidv4 from 'uuid/v4';
import '../App.css';
import DraggableBox from './draggable-box';
import ServerComm from '.././server-comm';
import TextBox from './text-box';
import ImageBox from './image-box';


class Board extends React.Component {
  constructor(props) {
    super(props);
    // this.socket = new ServerComm("TEST");
    // this.socket.setReceivedUpdateMessageHandler(this.onUpdate);
    this.state = {zIndex: 1, boxes: {}};
  }

  onUpdate = (msg) => {
    const updatedState = {}; // TODO: Seems redundant from updateBoardState, should change
    updatedState[msg.uuid].state = msg.state; // Doing this is necessary to index by UUID
    this.setState(updatedState);
  };

  updateBoardState = (uuidVal, curState) => {
    const updatedState = this.state.boxes;
    updatedState[uuidVal].state = curState; // Doing this is necessary to index by UUID
    // this.socket.sendUpdateMessage(uuid: uuidVal, state: curState)
    this.setState({textBoxes: updatedState});
  };

  updateZ = () => {
    this.setState({zIndex: this.state.zIndex + 1});
    return this.state.zIndex;
  }

  generateBox = (e) => {
    var boxType = e.target.dataset.type; // Get the type of box we're making
    const uuid = uuidv4(); // Gen unique UUID
    const initState = this.state.boxes;
    initState[uuid] = {
      type: boxType,
      state: {
        x: e.clientX,
        y: e.clientY,
        w: 200,
        h: 200,
        z: this.state.zIndex,
        color: randomColor()
      }
    };
    this.setState({boxes: initState});
    // console.log("Gen box")
  };

  componentDidMount() {
    document.addEventListener('ondrop', this.handleFileDrop)
  }

  handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.generateBox(e)
  }

  dragOverHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  /*
  Called on ImageBox load to resize image correctly
  */
  updateImage = (uuid, w, h) => {
    const initState = this.state.boxes;
    initState[uuid].state.w = w;
    initState[uuid].state.h = h;
    initState[uuid].aspect = w/h; // Store the aspect ratio
    this.setState({boxes: initState});
  }

  render() {
    const allKeys = Object.keys(this.state.boxes);
    var boxes = []
    for (var i=0; i < allKeys.length; i++) {
      var key = allKeys[i];
      var propsIn = {
        clickCallback: this.updateZ,
        uid: key,
        key: key,
        x: this.state.boxes[key].state.x,
        y: this.state.boxes[key].state.y,
        w: this.state.boxes[key].state.w,
        h: this.state.boxes[key].state.h,
        z: this.state.boxes[key].state.z,
        callback: this.updateBoardState,
        color: this.state.boxes[key].state.color
      };
      if (typeof this.state.boxes[key].aspect !== 'undefined') {
        propsIn.aspect = this.state.boxes[key].aspect;
      }

      if (this.state.boxes[key].type == "text") {
        boxes.push(<TextBox {...propsIn}/>);
      }
      else if (this.state.boxes[key].type == "image") {
        boxes.push(<ImageBox src="http://cdn.akc.org/content/hero/puppy-boundaries_header.jpg" imgCallback={this.updateImage} {...propsIn}/>);
      }
    }
    // console.log(this.state.zIndex);


    return (

      <div className="Wrapper" data-type= "image" onDrop={this.handleFileDrop} onDragOver={this.dragOverHandler}>
        <button data-type = "text" onClick={this.generateBox}>Box</button>
        <button data-type = "image" onClick={this.generateBox}>Image</button>
        {boxes}
      </div>
    );
  }
}


export default Board;

import React from 'react';
import randomColor from 'randomcolor';
import uuidv4 from 'uuid/v4';
import '../App.css';
import DraggableBox from './draggable-box';
import ServerComm from '.././server-comm';
import TextBox from './text-box';


class Board extends React.Component {
  constructor(props) {
    super(props);
    // this.socket = new ServerComm("TEST");
    // this.socket.setReceivedUpdateMessageHandler(this.onUpdate);
    this.state = {zIndex: 1, textBoxes: {}};
  }

  onUpdate = (msg) => {
    const updatedState = {}; // TODO: Seems redundant from updateBoardState, should change
    updatedState[msg.uuid] = msg.state; // Doing this is necessary to index by UUID
    this.setState(updatedState);
  };

  updateBoardState = (uuidVal, curState) => {
    const updatedState = this.state.textBoxes;
    updatedState[uuidVal] = curState; // Doing this is necessary to index by UUID
    // this.socket.sendUpdateMessage(uuid: uuidVal, state: curState)
    this.setState({textBoxes: updatedState});
  };

  updateZ = () => {
    this.setState({zIndex: this.state.zIndex + 1});
    return this.state.zIndex;
  }

  generateBox = () => {
    const uuid = uuidv4();
    const initState = this.state.textBoxes;
    initState[uuid] = {
      x: 0,
      y: 0,
      w: 200,
      h: 200,
      z: this.state.zIndex,
      color: randomColor(),
    };
    this.setState({textBoxes: initState});
  };

  render() {
    const allKeys = Object.keys(this.state.textBoxes);
    // console.log(this.state.zIndex);

    return (
      <div>
        <button onClick={this.generateBox}>Box</button>
        {allKeys.map((key, index) =>
            (<TextBox
              clickCallback={this.updateZ}
              uid={key}
              key={key}
              x={this.state.textBoxes[key].x}
              y={this.state.textBoxes[key].y}
              w={this.state.textBoxes[key].w}
              h={this.state.textBoxes[key].h}
              z={this.state.textBoxes[key].z}
              callback={this.updateBoardState}
              color={this.state.textBoxes[key].color}
            />))}
      </div>
    );
  }
}


export default Board;

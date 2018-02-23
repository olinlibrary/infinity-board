import React from 'react';
import randomColor from 'randomcolor';
import uuidv4 from 'uuid/v4';
import '../App.css';
import DraggableBox from './draggable-box';
import ServerComm from '.././server-comm';


class Board extends React.Component {
  constructor(props) {
    super(props);
    // this.socket = new ServerComm("TEST");
    // this.socket.setReceivedUpdateMessageHandler(this.onUpdate);
    this.state = {};
  }

  onUpdate = (msg) => {
    const updatedState = {}; // TODO: Seems redundant from updateBoardState, should change
    updatedState[msg.uuid] = msg.state; // Doing this is necessary to index by UUID
    this.setState(updatedState);
  };

  updateBoardState = (uuidVal, curState) => {
    const updatedState = {};
    updatedState[uuidVal] = curState; // Doing this is necessary to index by UUID
    // this.socket.sendUpdateMessage(uuid: uuidVal, state: curState)
    this.setState(updatedState);
  };

  generateBox = () => {
    const uuid = uuidv4();
    const initState = {};
    initState[uuid] = {
      x: 0,
      y: 0,
      w: 200,
      h: 200,
      color: randomColor(),
    };
    this.setState(initState);
  };

  render() {
    const allKeys = Object.keys(this.state);

    return (
      <div>
        <button onClick={this.generateBox}>Box</button>
        {allKeys.map((key, index) =>
            (<DraggableBox
              uid={key}
              key={key}
              x={this.state[key].x}
              y={this.state[key].y}
              w={this.state[key].w}
              h={this.state[key].h}
              callback={this.updateBoardState}
              color={this.state[key].color}
            />))}
      </div>
    );
  }
}


export default Board;

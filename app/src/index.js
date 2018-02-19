import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class DraggableBox extends React.Component {

    constructor(props) {
      super(props);
      this.state = {x: 0, y: 0, draggable: false, downX: 0, downY: 0, elemX: 0, elemY: 0, cursor: 'default', xSize: 200, ySize: 200, text: 'test'};
    }

    componentDidMount(props, state) {
      // We have to add document listeners so it will update pos even when
      document.addEventListener('mousemove', this.mouseMove.bind(this));
      document.addEventListener('mouseup', this.mouseUp.bind(this));
    }

    mouseMove(e) {
      this.setState({x: e.screenX, y: e.screenY})
      if (this.cursorInDraggingPosition(e)) {
        this.setState({cursor: 'se-resize'});
      }
      else {
        this.setState({cursor: 'default'})
      }
      if (this.state.draggable) {
        this.setState({elemX: this.state.x + this.state.downX, elemY: this.state.y + this.state.downY});
      }
    }

    mouseDown(e) {
      this.setState({draggable: true, downX: this.state.elemX - e.screenX, downY: this.state.elemY - e.screenY, cursor: 'move'});
    }

    mouseUp(e) {
      this.setState({draggable: false, cursor: 'default'});
    }


    cursorInDraggingPosition(e) {
      var cornerX = Math.pow((e.clientX-this.state.elemX)-this.state.xSize, 2);
      var cornerY = Math.pow((e.clientY-this.state.elemY)-this.state.ySize, 2);
      var dist = Math.sqrt(cornerX+cornerY)
      this.setState({text: dist})
      return (dist<15)
    }


    getBoxStyle() {
      var boxStyle = {
        backgroundColor: 'red',
        left: this.state.elemX + 'px',
        top: this.state.elemY + 'px',
        width: this.state.xSize + 'px',
        height: this.state.ySize + 'px',
        cursor: this.state.cursor

      };
      return boxStyle;
    }

    render() {
      return (
        <div
        onMouseDown={this.mouseDown.bind(this)}
        className={'Box'}
        style={this.getBoxStyle()}>{this.state.text}</div>
      )
    }

}



ReactDOM.render(<DraggableBox />, document.getElementById('root'));

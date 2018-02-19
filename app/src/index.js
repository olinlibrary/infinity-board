import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class DraggableBox extends React.Component {

    constructor(props) {
      super(props);
      this.state = {x: 0, y: 0, draggable: false, downX: 0, downY: 0, elemX: 0,
                    elemY: 0, cursor: 'default', xSize: 240, ySize: 240,
                    resizing: false, editing: false, mouseMoved: false, value: ''};
    }

    componentDidMount(props, state) {
      // We have to add document listeners so it will update pos even when
      document.addEventListener('mousemove', this.mouseMove.bind(this));
      document.addEventListener('mouseup', this.mouseUp.bind(this));
    }

    onInput(e) {
      if (this.state.editing) {
        this.setState({value: e.target.value})
      }
    }

    mouseMove(e) {
      if (this.state.mouseDown) {
        this.setState({mouseMoved: true})
      }

      this.setState({x: e.screenX, y: e.screenY})
      if (this.cursorInDraggingPosition(e) || this.state.resizing) {
        this.setState({cursor: 'se-resize'});
      }
      else if (this.state.cursor != 'move'){
        this.setState({cursor: 'default'})
      }

      if (this.state.resizing) {
        var xVal = e.clientX-this.state.elemX;
        if (xVal >= 240) { // as long as the size is greater than minimum, hard-coded for now
          this.setState({xSize: xVal});
        }
        var yVal = e.clientY-this.state.elemY;
        if (yVal >= 240) { // as long as the size is greater than minimum, hard-coded for now
          this.setState({ySize: yVal});
        }
      }
      else if (this.state.draggable) {
        this.setState({elemX: this.state.x + this.state.downX, elemY: this.state.y + this.state.downY});
      }

    }

    mouseDown(e) {
      this.setState({draggable: true, downX: this.state.elemX - e.screenX, downY: this.state.elemY - e.screenY, mouseMoved: false});
      if (this.cursorInDraggingPosition(e)) {
        this.setState({resizing: true})
      }
      else {
        this.setState({cursor: 'move'})
      }
    }

    mouseUp(e) {
      if (!this.state.mouseMoved) {
        this.setState({editing: true})
      }
      this.setState({draggable: false, cursor: 'default', resizing: false, mouseMoved: true});
    }


    cursorInDraggingPosition(e) {
      var cornerX = Math.pow((e.clientX-this.state.elemX)-this.state.xSize, 2);
      var cornerY = Math.pow((e.clientY-this.state.elemY)-this.state.ySize, 2);
      var dist = Math.sqrt(cornerX+cornerY)
      return (dist<15)
    }


    getBoxStyle() {
      var boxStyle = {
        backgroundColor: 'red',
        left: this.state.elemX + 'px',
        top: this.state.elemY + 'px',
        width: this.state.xSize - 40 + 'px',
        height: this.state.ySize - 40 + 'px',
        cursor: this.state.cursor
      };
      return boxStyle;
    }

    render() {
      // if (this.state.editing) {
        return (
          <div onMouseDown={this.mouseDown.bind(this)} className={'Box'} style={this.getBoxStyle()}>
            <textarea value={this.state.value} className={'Text-box'} onChange = {this.onInput.bind(this)} style={{cursor: this.state.cursor}}>
            </textarea>
          </div>
        )
      // }
      // else {
      //   return (
      //     <div onMouseDown={this.mouseDown.bind(this)} className={'Box'} style={this.getBoxStyle()}>
      //     </div>
      //   )
      // }

    }

}



ReactDOM.render(<DraggableBox />, document.getElementById('root'));

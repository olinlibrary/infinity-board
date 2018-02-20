import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';


class DraggableBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {x: 0, y: 0, draggable: false, downX: 0, downY: 0, elemX: 0,
                  elemY: 0, xSize: 200, ySize: 200,
                  resizing: false, editing: false, value: '', hasMoved: false, cursor: 'default'};
  }

  componentDidMount(props, state) {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousemove', this.mouseMove.bind(this));
    document.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  onInput(e) {
    this.setState({value: e.target.value})
  }

  mouseMove(e) {
    this.setState({x: e.clientX, y: e.clientY, hasMoved: true})

    if (this.state.resizing) {
      this.setState({xSize: this.getResize(this.state.x, this.state.elemX, this.props.minX),
                     ySize: this.getResize(this.state.y, this.state.elemY, this.props.minY)})
    }
    else if (this.state.draggable) {
      this.setState({elemX: e.screenX + this.state.downX, elemY: e.screenY + this.state.downY});
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
    this.setState({downX: this.state.elemX - e.screenX, downY: this.state.elemY - e.screenY, hasMoved: false});
    if (this.cursorInDraggingPosition(e)) {
      this.setState({resizing: true})
    }
    else if (!this.state.editing) {
      this.setState({draggable: true})
    }
  }


  mouseUp(e) {
    if (!this.state.hasMoved) {
      this.setState({editing: true})
    }
    else {
      this.setState({editing: false})
     }
    this.setState({draggable: false, resizing: false});
  }


  cursorInDraggingPosition() {
    var cornerX = Math.pow(this.state.x-this.state.elemX-this.state.xSize, 2);
    var cornerY = Math.pow(this.state.y-this.state.elemY-this.state.ySize, 2);
    var dist = Math.sqrt(cornerX+cornerY);
    return (dist<20);
  }

  getCursor() {
    if (this.state.editing) {
      return 'text';
    }
    else if (this.state.draggable) {
      return 'move';
    }
    else if (this.state.resizing || this.cursorInDraggingPosition()) {
      return 'se-resize';
    }
    else {
      return 'default';
    }
  }


  getBoxStyle() {
    var boxStyle = {
      backgroundColor: 'red',
      left: this.state.elemX + 'px',
      top: this.state.elemY + 'px',
      width: this.state.xSize - 2*this.props.padding + 'px',
      height: this.state.ySize - 2*this.props.padding + 'px',
      cursor: this.getCursor()
    };
    return boxStyle;
  }

  getTextStyle() {
    var textStyle = {
      color: 'white',
      textShadow: 'none'
    };
    return textStyle
  }

  render() {
    if (this.state.editing) {
      return (

        <div onMouseDown={this.mouseDown.bind(this)} className={'Box'} style={this.getBoxStyle()}>{this.state.text}
          <textarea autoFocus="autofocus" value={this.state.value} className={'Text-box unselectable'} onChange = {this.onInput.bind(this)} style={this.getTextStyle()}>
          </textarea>
        </div>
      )
    }
    else{
      return (
        <div onMouseDown={this.mouseDown.bind(this)} className={'Box'} style={this.getBoxStyle()}>
          <div className={'Text-box unselectable'} style={this.getTextStyle()}>{this.state.value}</div>
        </div>
      )
    }
  }
}

DraggableBox.defaultProps = {
  padding: 20,
  minX: 200,
  minY: 200
};

export default DraggableBox;

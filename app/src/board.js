import React from 'react';

class DraggableBox extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.children.props)
    this.state = {x: 0, y: 0, draggable: false, downX: 0, downY: 0, elemX: 0,
                  elemY: 0, xSize: 200, ySize: 200,
                  resizing: false, cursor: 'default'};
  }

  componentDidMount(props, state) {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousemove', this.mouseMove.bind(this));
    document.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  mouseMove(e) {
    this.setState({x: e.clientX, y: e.clientY})

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
    if (e.button == 0) { // Check to make sure it's left mouse click
      this.setState({downX: this.state.elemX - e.screenX, downY: this.state.elemY - e.screenY});
      if (this.cursorInDraggingPosition(e)) {
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
    var cornerX = Math.pow(this.state.x-this.state.elemX-this.state.xSize, 2);
    var cornerY = Math.pow(this.state.y-this.state.elemY-this.state.ySize, 2);
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


  getBoxStyle() {
    var boxStyle = {
      backgroundColor: 'red',
      left: this.state.elemX + 'px',
      top: this.state.elemY + 'px',
      width: this.state.xSize - 2*this.props.padding + 'px',
      height: this.state.ySize - 2*this.props.padding + 'px',
      cursor: this.getCursor(),
      padding: this.props.padding + 'px'
    };
    return boxStyle;
  }

  render() {
      return (
        <div onMouseDown={this.mouseDown.bind(this)} className={'Box'} style={this.getBoxStyle()}>{this.state.text}
          {this.props.children}
        </div>
      )
  }
}

DraggableBox.defaultProps = {
  padding: 20,
  minX: 200,
  minY: 200
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
    // this.state = {width: this.img.clientWidth, height: this.img.clientWidth}
  }

  render() {
    var imgStyle = {
      background: "url(" + this.props.src + ")"
    }
    return (
      <DraggableBox padding={0}>
        <div className={'Box-image'} style={imgStyle}>
          <img src={this.props.src} style={{visibility: "hidden"}}/>
        </div>
      </DraggableBox>
    )
  }
}


class Board extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
          <DraggableBox>
            <TextField></TextField>
          </DraggableBox>
          <ImageBox src="http://cdn1-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-2.jpg"></ImageBox>
        </div>
      )
    }
}



export default Board;

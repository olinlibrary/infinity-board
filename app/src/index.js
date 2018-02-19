import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class DraggableBox extends React.Component {

    constructor(props) {
      super(props);
      this.state = {x: 0, y: 0, draggable: false, downX: 0, downY: 0, elemX: 0, elemY: 0};
    }

    componentDidMount(props, state) {
      // We have to add document listeners so it will update pos even when
      document.addEventListener('mousemove', this.mouseMove.bind(this))
      document.addEventListener('mouseup', this.mouseUp.bind(this))
    }

    mouseMove(e) {
      this.setState({x: e.screenX, y: e.screenY})
      if (this.state.draggable) {
        this.setState({elemX: this.state.x + this.state.downX, elemY: this.state.y + this.state.downY})
      }
    }

    mouseDown(e) {
      this.setState({draggable: true, downX: this.state.elemX - e.screenX, downY: this.state.elemY - e.screenY});
    }

    mouseUp(e) {
      this.setState({draggable: false});
    }

    mouseExit(e) {
      this.style.cursor = 'default'
    }

    mouseEnter(e) {
      this.style.cursor = 'move'
    }

    getBoxStyle() {
      var boxStyle = {
        backgroundColor: 'red',
        left: this.state.elemX + 'px',
        top: this.state.elemY + 'px'
      };
      return boxStyle;
    }

    render() {
      return (
        <div
        onMouseDown={this.mouseDown.bind(this)}
        onMouseEnter={this.mouseEnter.bind(this)}
        onMouseExit = {this.mouseExit.bind(this)}
        className={'Box'}
        style={this.getBoxStyle()}></div>
      )
    }

}



ReactDOM.render(<DraggableBox />, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {x: 0, y: 0, draggable: false, downX: 0, downY: 0, elemX: 0, elemY: 0};
    }

    _onMouseMove(e) {
      this.setState({x: e.screenX, y: e.screenY});
      if (this.state.draggable) {
          this.setState({elemX: this.state.x + this.state.downX, elemY: this.state.y + this.state.downY})
      }
    }

    _onMouseDown(e) {
      this.setState({draggable: true, downX: this.state.elemX - e.screenX, downY: this.state.elemY - e.screenY});
    }

    _onMouseUp(e) {
      this.setState({draggable: false});
    }

    render() {
      var boxStyle = {
        backgroundColor: 'red',
        left: this.state.elemX + 'px',
        top: this.state.elemY + 'px'
      };
      return (
      <div onMouseMove={this._onMouseMove.bind(this)} className={'Screen'}>
        <div onMouseUp={this._onMouseUp.bind(this)} onMouseDown={this._onMouseDown.bind(this)}  className={'Box'} style={boxStyle}></div>
      </div>
      )
    }

}



ReactDOM.render(<App />, document.getElementById('root'));

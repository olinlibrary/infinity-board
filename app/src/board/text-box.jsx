import React from 'react';
import DraggableBox from './draggable-box';
import TextField from './text-field';

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
  }

  onClick = () => {
    const editingState = !this.state.editing;
    this.setState({ editing: editingState });
  }

  render() {
    return (
      <div>
        <DraggableBox textCallback={this.onClick} {...this.props}>
          <TextField edit={this.state.editing} />
        </DraggableBox>
      </div>
    );
  }
}

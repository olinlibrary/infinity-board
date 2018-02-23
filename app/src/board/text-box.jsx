import React from 'react';
import PropTypes from 'prop-types';
import DraggableBox from './draggable-box';
import TextField from './text-field';

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DraggableBox {...this.props}>
        <TextField></TextField>
        </DraggableBox>
      </div>
    );
  }
}

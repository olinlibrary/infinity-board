import PropTypes from 'prop-types';
import React from 'react';
import DraggableBox from './draggable-box';
import TextField from './text-field';

/**
 * A board component for displaying editable text.
 */
export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
  }

  /**
   * Handles click events by changing the editing state.
   */
  onClick = () => {
    const editingState = !this.state.editing;
    this.setState({ editing: editingState });
  };

  render() {
    const {
      editCallback,
      text,
      uid,
      ...other
    } = this.props;
    return (
      <div>
        <DraggableBox
          textCallback={() => { this.setState({ editing: true }); }}
          uid={uid}
          {...other}
        >
          <TextField
            edit={this.state.editing}
            editCallback={editCallback}
            value={text}
            uid={uid}
            blurFunc={() => { this.setState({ editing: false }); }}
          />
        </DraggableBox>
      </div>
    );
  }
}

TextBox.propTypes = {
  editCallback: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
};

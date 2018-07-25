import PropTypes from 'prop-types';
import React from 'react';
import Box from './box';
import TextField from './text-field';

/**
 * A board component for displaying editable text.
 */
export default class TextBox extends React.Component {
  /**
   * Handles click events by changing the editing state.
   */
  setEditingState = () => {
    if (!this.props.mouseMove && !this.props.editing) {
      const editingState = !this.props.editing;
      this.props.setEditing(this.props.uuid, editingState);
    }
  };

  render() {
    // Absorb some of the props
    const {
      editCallback,
      text,
      uuid,
      ...other
    } = this.props;
    return (
      // eslint-disable-next-line
      <div onMouseUp={this.setEditingState}>
        <Box
          uuid={uuid}
          {...other}
        >
          <TextField
            edit={this.props.editing}
            editCallback={editCallback}
            value={text}
            uuid={uuid}
            blurFunc={() => { this.props.setEditing(this.props.uuid, false); }}
          />
        </Box>
      </div>
    );
  }
}

TextBox.propTypes = {
  editCallback: PropTypes.func.isRequired,
  setEditing: PropTypes.func.isRequired,
  mouseMove: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

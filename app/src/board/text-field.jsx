import React from 'react';
import PropTypes from 'prop-types';

/**
 * A board component to allow editing the content of a text board element.
 */
class TextField extends React.Component {
  /**
   * Called on a change in the text value.
   * @param e - the event associated with the input change
  */
  onInput = (e) => {
    e.preventDefault();
    this.props.editCallback(this.props.uuid, e.target.value);
  };

  render() {
    if (this.props.edit) {
      return (<textarea
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus="autofocus"
        value={this.props.value}
        className="Text-box unselectable"
        onChange={this.onInput}
        onBlur={this.props.blurFunc}
        style={{ cursor: 'text', resize: 'none' }}
      />);
    }
    // Render a div to make text unselectable (CSS properties weren't working on all browsers)
    return (<div className="Text-box unselectable">{this.props.value}</div>);
  }
}

TextField.defaultProps = {
  edit: false,
};

TextField.propTypes = {
  blurFunc: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
  editCallback: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
export default TextField;

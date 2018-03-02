import React from 'react';
import PropTypes from 'prop-types';


class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      cursor: 'inherit',
    };
  }

  onInput = (e) => {
    e.preventDefault();
    this.props.editCallback(this.props.uid, e.target.value);
    // this.setState({ value: e.target.value });
  };

  onFocus = (e) => {
    e.preventDefault();
  };

  render() {
    if (this.props.edit) {
      return (<textarea
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus="autofocus"
        value={this.props.value}
        className="Text-box unselectable"
        onChange={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={{ cursor: 'text', resize: 'none' }}
      />);
    }
    return (<div className="Text-box unselectable">{this.props.value}</div>);
  }
}

TextField.defaultProps = {
  edit: false,
};

TextField.propTypes = {
  edit: PropTypes.bool,
  uid: PropTypes.string.isRequired,
  editCallback: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
export default TextField;

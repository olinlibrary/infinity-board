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
    this.setState({ value: e.target.value });
  };

  onFocus = (e) => {
    e.preventDefault();
  };

  render() {
    if (this.props.edit) {
      return (<textarea
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus="autofocus"
        value={this.state.value}
        className="Text-box unselectable"
        onChange={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={{ cursor: 'text' }}
      />);
    }
    return (<div className="Text-box unselectable">{this.state.value}</div>);
  }
}

TextField.defaultProps = {
  edit: false,
};

TextField.propTypes = {
  edit: PropTypes.bool,
};
export default TextField;

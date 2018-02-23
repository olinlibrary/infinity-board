import React from 'react';

class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      editing: false,
      cursor: 'inherit',
    };
  }

  onInput = (e) => {
    this.setState({ value: e.target.value });
  };

  onFocus = (e) => {
    this.setState({ editing: true, cursor: 'text' });
  };

  onBlur = (e) => {
    this.setState({ editing: false, cursor: 'inherit' });
  };

  render() {
    const textStyle = { cursor: this.state.cursor };
    if (this.state.editing) {
      return (<textarea
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus="autofocus"
        value={this.state.value}
        className="Text-box unselectable"
        onChange={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={textStyle}
      />);
    }
    return (<div className="Text-box unselectable" onClick={this.onFocus}>{this.state.value}</div>);
  }
}

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
    e.preventDefault();
    // this.setState({ editing: true, cursor: 'text' });
  };

  onBlur = (e) => {
    // this.setState({ editing: false, cursor: 'inherit' });
  };

  render() {
    const textStyle = { cursor: this.state.cursor };
    if (this.props.edit) {
      return (<textarea
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus="autofocus"
        value={this.state.value}
        className="Text-box unselectable"
        onChange={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        style={{cursor: "text"}}
      />);
    }
    return (<div className="Text-box unselectable">{this.state.value}</div>);
  }
}

export default TextField;

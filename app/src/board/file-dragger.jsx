import React from 'react';
import PropTypes from 'prop-types';

export default class FileDragger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOverState: {
        visibility: 'hidden',
        zIndex: -1,
      },
    };
  }

  componentDidMount() {
    document.addEventListener('drop', this.handleFileDrop);
    document.addEventListener('dragover', this.dragOverHandler);
    document.addEventListener('dragleave', this.dragLeaveHandler);
  }

  /*
  Handles when a file is selected from the file selection dialog.
  */
  onFileSelect = (e) => {
    e.preventDefault();
    this.props.generateBox('image');
  };

  /*
  Generates a box based on a browser file drop event.
  @params e: the file drop event.
  */
  handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.generateBox('image');
    this.dragLeaveHandler(e);
  };

  /*
  Makes the drag over div visible.
  @params e: the file drag event.
  */
  dragOverHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragOverState: {
        opacity: 1,
        zIndex: this.state.zIndex,
      },
    });
  };

  /*
  Makes the drag over div invisible.
  @params e: the file drag leave event.
  */
  dragLeaveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragOverState: {
        opacity: 0,
        zIndex: -1,
      },
    });
  };


  render() {
    return (
      <div className="Wrapper File-drop" style={this.state.dragOverState}>
        <div className="Drop-text">DROP FILE HERE</div>
      </div>
    )
  }
}

FileDragger.propTypes = {
  update: PropTypes.func.isRequired,
  generateBox: PropTypes.func.isRequired,
  // eslint-disable-next-line
  dragState: PropTypes.object.isRequired,
}

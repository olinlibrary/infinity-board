import React from 'react';
import PropTypes from 'prop-types';
import DraggableBox from './draggable-box';

export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      imgStyle: {
        visibility: 'visible',
      },
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  onImgLoad({ target: img }) {
    this.setState({ width: img.offsetWidth, height: img.offsetHeight });
  }

  render() {
    const imgStyle = {
      background: `url(${this.props.src})`,
    };
    return (
      <div>
        <DraggableBox padding={0} defaultWidth={this.state.width} defaultHeight={this.state.height}>
          <div className="Box-image" style={imgStyle} >
            {this.state.width}{this.state.height}
            <img src={this.props.src} onLoad={this.onImgLoad} style={{ visibility: 'hidden' }} alt="" />
          </div>
        </DraggableBox>
      </div>
    );
  }
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
};

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

  onImgLoad = ({ target: img }) => {
    console.log(img.offsetWidth);
    this.setState({ width: img.offsetWidth, height: img.offsetHeight });
  }

  render() {
    const imgStyle = {
      background: `url(${this.props.src})`,
    };
    var {source, ...other} = this.props; // Get the image src
    return (
      <div>
        <DraggableBox padding={0} defaultWidth={this.state.width} defaultHeight={this.state.height} {...other}>
          <div className="Box-image" style={imgStyle}>
            <img src={source} onLoad={this.onImgLoad} style={{ visibility: 'hidden' }} alt="" />
          </div>
        </DraggableBox>
      </div>
    );
  }
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
};

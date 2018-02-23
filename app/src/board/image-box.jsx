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

  /*
    Update our state in the board to reflect the height of the image
  */
  onImgLoad({ target: img }) { //
    this.props.imgCallback(this.props.uid, img.offsetWidth, img.offsetHeight);
  }

  render() {
    var {src, imgCallback, ...other} = this.props; // Get the image src
    const imgStyle = {
      backgroundImage: `url(${src})`,
    };
    return (
      <div>
        <DraggableBox padding={0} defaultWidth={this.state.width} defaultHeight={this.state.height} {...other}>
          <div className="Box-image" style={imgStyle}>
            <img src={src} onLoad={this.onImgLoad} style={{visibility: "hidden"}} alt="" />
          </div>
        </DraggableBox>
      </div>
    );
  }
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
};

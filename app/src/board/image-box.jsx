import React from 'react';
import PropTypes from 'prop-types';
import DraggableBox from './draggable-box';

export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      opacity: 0,
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  /*
    Update our state in the board to reflect the height of the image
  */
  onImgLoad({ target: img }) { //
    this.props.imgCallback(
      this.props.uid,
      img.offsetWidth,
      img.offsetHeight,
      this.props.w,
      this.props.h
    );
    this.setState({ opacity: 1 });
  }

  render() {
    const { src, imgCallback, ...other } = this.props; // Get the image src
    const imgStyle = {
      backgroundImage: `url(${src})`,
      opacity: this.state.opacity,
      visibility: 'visible',
    };
    return (
      <div>
        <DraggableBox
          padding={0}
          textCallback={this.textFunc}
          defaultWidth={this.state.width}
          defaultHeight={this.state.height}
          style={{ visibility: 'hidden' }}
          {...other}
        >
          <div className="Box-image" style={imgStyle}>
            <img src={src} onLoad={this.onImgLoad} style={{ visibility: 'hidden' }} alt="" />
          </div>
        </DraggableBox>
      </div>
    );
  }
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
  imgCallback: PropTypes.func,
  uid: PropTypes.string.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
};

ImageBox.defaultProps = {
  imgCallback: () => {},
};

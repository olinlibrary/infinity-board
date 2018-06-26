import React from 'react';
import PropTypes from 'prop-types';
import Box from './box';

/**
 * A board element for displaying images.
 */
export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  /**
   * Update our state in the board to reflect the height of the image
   */
  onImgLoad({ target: img }) { //
    this.props.imgCallback(
      this.props.uuid,
      img.offsetWidth,
      img.offsetHeight,
      this.props.isUpload,
    );
    // eslint-disable-next-line
    console.log("Image loaded.");
    this.props.setImgLoaded(this.props.uuid, true);
  }

  render() {
    const { src, imgCallback, ...other } = this.props; // Get the image src
    const imgStyle = {
      backgroundImage: `url(${src})`,
      opacity: this.props.opacity,
      visibility: 'visible',
    };
    const loaded = this.props.isLoaded;
    return (
      <div>
        <Box
          padding={0}
          defaultWidth={0}
          defaultHeight={0}
          visibility="hidden"
          {...other}
        >
          {loaded ? (
            <div className="Box-image" style={imgStyle} />) : (
              <div className="loader" style={{ visibility: 'visible' }} >
                <img src={src} onLoad={this.onImgLoad} style={{ visibility: 'hidden' }} alt="" />
              </div>
            )}
        </Box>
      </div>);
  }
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
  imgCallback: PropTypes.func.isRequired,
  setImgLoaded: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
  isUpload: PropTypes.bool,
  opacity: PropTypes.number,

  isLoaded: PropTypes.bool,
};

ImageBox.defaultProps = {
  opacity: 1,
  isUpload: false,
  isLoaded: false,
};

import React from 'react';
import PropTypes from 'prop-types';
import DraggableBox from './draggable-box';

export default class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      isLoaded: false,
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  /*
    Update our state in the board to reflect the height of the image
  */
  onImgLoad({ target: img }) { //
    this.props.imgCallback(
      this.props.uuid,
      img.offsetWidth,
      img.offsetHeight,
      this.props.isUpload,
    );
    console.log("Image loaded.")
    this.setState({ isLoaded: true })
  }

  render() {
    const { src, imgCallback, ...other } = this.props; // Get the image src
    const imgStyle = {
      backgroundImage: `url(${src})`,
      opacity: this.props.opacity,
      visibility: 'visible',
    };
    const loaded = this.state.isLoaded;
    return (
      <div>
        <DraggableBox
          padding={0}
          textCallback={this.textFunc}
          defaultWidth={this.state.width}
          defaultHeight={this.state.height}
          visibility={'hidden'}
          {...other}
        >
          {loaded ? (
            <div className="Box-image" style={imgStyle} />) : (
              <div className="loader" style={{ visibility: 'visible' }} >
                <img src={src} onLoad={this.onImgLoad} style={{ visibility: 'hidden' }} alt="" />
              </div>
            )}
        </DraggableBox>
      </div>);
  }
}

ImageBox.propTypes = {
  src: PropTypes.string.isRequired,
  imgCallback: PropTypes.func,
  uuid: PropTypes.string.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  isUpload: PropTypes.bool,
  opacity: PropTypes.number,
};

ImageBox.defaultProps = {
  opacity: 1,
  imgCallback: () => {},
  isUpload: false,
};

import React from "react";
import PropTypes from "prop-types";

const CoursePlayer = (props) => (
  <div className="video-responsive">
    <iframe
      width="853"
      height="480"
      src={`${props.embedLink}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

CoursePlayer.propTypes = {
  embedLink: PropTypes.string.isRequired
};

export default CoursePlayer;
import React from "react";
import PropTypes from "prop-types";

const CoursePlayer = ({ embedLink }) => (
  <div className="video-responsive">
    <iframe
      width="853"
      height="480"
      src={`${embedLink}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

CoursePlayer.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default CoursePlayer;
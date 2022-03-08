import React from "react";
import PropTypes from "prop-types";

const CoursePlayer = (props) => {
  const match = props.contentLink.match(/youtube\.com.*(\?v=|\/watch\/)(.{11})/);
  let youtubeVideoID;
  if (match) {
    youtubeVideoID = match.pop();
  }
  const embedLink = `//youtube.com/embed/${youtubeVideoID}`;
  return (
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
};

CoursePlayer.propTypes = {
  contentLink: PropTypes.string.isRequired
};

export default CoursePlayer;
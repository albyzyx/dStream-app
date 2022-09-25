import { useEffect } from "react";
import styled from "styled-components";

const VideoPlayer = ({ videoURI, h, w }) => {
  useEffect(() => {
    var video = document.getElementById("video-player") as HTMLVideoElement;
    var source = document.createElement("source");

    source.setAttribute("src", videoURI);
    source.setAttribute("type", "video/mp4");

    video.load();
    video.play();
  }, [videoURI]);

  return (
    <Player>
      <video id="video-player" width={w} height={h} controls autoPlay loop>
        <source id="source" src={videoURI} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Player>
  );
};

const Player = styled.div`
  video {
    border-radius: 24px;
    /* background-color: aqua; */
  }
  video::-webkit-media-controls-panel {
    // Your styling here
    background-image: linear-gradient(
      transparent,
      transparent
    ) !important; //Transparent for your case
  }
`;
export default VideoPlayer;

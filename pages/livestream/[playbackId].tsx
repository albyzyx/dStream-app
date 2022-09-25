import styled from "styled-components";

import { useRouter } from "next/router";
import SideBar from "../../components/SideBar";
import { useCallback, useEffect, useState } from "react";
import videojs from "video.js";
import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";

const LivestreamPlayer = () => {
  const router = useRouter();
  const { playbackId } = router.query;
  const [videoEl, setVideoEl] = useState(null);

  useEffect(() => {
    if (videoEl == null) return;
    if (true) {
      console.log(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
      const player = videojs(videoEl, {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
          },
        ],
      });

      // player.hlsQualitySelector();

      player.on("error", () => {
        // player.src(
        //   `https://ipfs.livepeer.com/ipfs/QmXygtfhjyRzmLdafCguuYLn3Fe6Nq8fkMsHNk1KYvFzsq`
        // );
      });
    }
  }, [videoEl]);

  const onVideo = useCallback((el) => {
    setVideoEl(el);
  }, []);
  return (
    <Container>
      <SideBar min={true} />
      <Contents>
        <h1>{playbackId}</h1>

        <div className="container w-full h-full flex flex-col  overflow-auto pb-14">
          <div className="relative bg-black h-full w-full overflow-hidden">
            <div data-vjs-player>
              <video
                id="video"
                ref={onVideo}
                className="h-full w-full video-js vjs-theme-city"
                controls
                playsInline
              />
            </div>
            <div className="bg-white rounded-xl flex items-center justify-center absolute right-2 top-2 p-1 text-xs">
              <div
                className={`animate-pulse ${
                  true ? "bg-green-700" : "bg-yellow-600"
                } h-2 w-2 mr-2 rounded-full`}
              ></div>
              {true ? "Live" : "Waiting for Video"}
            </div>
          </div>
        </div>
      </Contents>
    </Container>
  );
};

LivestreamPlayer.getInitialProps = async ({ query }) => {
  const { playbackId } = query;
  return { playbackId };
};

const Container = styled.div`
  padding: 24px 0;
  margin-left: 100px;
  background-image: linear-gradient(110deg, #1f1d2b, #1f1d2b, #312e41);
  height: 100vh;
  background-size: cover;
  display: flex;
  h1 {
    color: #fff;
    /* margin-bottom: 0; */
    margin-left: 24px;
  }
  span {
    color: #808191;
  }
`;
const Contents = styled.div`
  /* display: flex;
  grid-gap: 48px;
  flex-wrap: wrap;
  margin-top: 54px; */
  margin-right: 100px;
  margin-bottom: 100px;
  width: 100%;
`;

export default LivestreamPlayer;

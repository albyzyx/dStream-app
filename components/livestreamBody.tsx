import React from "react";
import videojs from "video.js";
import styled from "styled-components";
import "videojs-contrib-hls";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";

enum APP_STATES {
  API_KEY = 0,
  CREATE_BUTTON = 1,
  CREATING_STREAM = 2,
  WAITING_FOR_VIDEO = 3,
  SHOW_VIDEO = 4,
}

interface Props {
  state: any;
  createStream: () => void;
  exitStream: () => void;
}

const copyTextToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const LivestreamBody: React.FC<Props> = ({
  state,
  createStream,
  exitStream,
}) => {
  const { playbackId, streamIsActive, streamKey } = state;
  const [showRequest, setShowRequest] = React.useState(false);
  const [videoEl, setVideoEl] = React.useState(null);

  const onVideo = React.useCallback((el) => {
    setVideoEl(el);
  }, []);

  React.useEffect(() => {
    if (videoEl == null) return;
    if (streamIsActive && playbackId) {
      console.log(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
      const player = videojs(videoEl, {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
            // src: `https://ipfs.livepeer.com/ipfs/QmXygtfhjyRzmLdafCguuYLn3Fe6Nq8fkMsHNk1KYvFzsq`,
          },
        ],
      });

      //   player.hlsQualitySelector();

      player.on("error", () => {
        player.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
      });
    }
  }, [streamIsActive]);

  const [streamName, setStreamName] = React.useState("");

  switch (state.appState) {
    // case APP_STATES.API_KEY:
    //   return <APIKeyForm setApiKey={setApiKey} />;
    case APP_STATES.CREATE_BUTTON:
      return (
        <div className="flex flex-col items-center justify-center">
          <Search>
            <input
              id="search"
              placeholder="Stream name"
              onChange={(e) => {
                setStreamName(e.target.value);
              }}
            />
          </Search>
          <ConnectButton onClick={createStream}>Create Stream</ConnectButton>
        </div>
      );
    case APP_STATES.CREATING_STREAM:
      return (
        <div className="w-full h-3/5 flex flex-col items-center justify-center">
          <svg
            role="status"
            className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="mt-5">Creating stream...</span>
        </div>
      );
    case APP_STATES.WAITING_FOR_VIDEO:
    case APP_STATES.SHOW_VIDEO:
      return (
        <div className="container w-full flex flex-col items-center overflow-auto pb-14">
          <h1>{streamName}</h1>
          <div className="relative bg-black h-56 lg:h-96 w-full xl:w-3/5 overflow-hidden">
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
                  streamIsActive ? "bg-green-700" : "bg-yellow-600"
                } h-2 w-2 mr-2 rounded-full`}
              ></div>
              {streamIsActive ? "Live" : "Waiting for Video"}
            </div>
          </div>

          <div className="w-11/12 lg:w-full xl:w-3/5 lg:p-0 mt-2 text-red-500 text-left text-sm">
            <span className="font-bold">Note:&nbsp;</span> To start a video
            stream, please use a broadcaster software like OBS/Streamyard on
            desktop, or Larix on mobile.
          </div>
          <div className="w-11/12 lg:w-full xl:w-3/5  p-2 m-4 flex flex-col text-sm">
            <div className="flex items-center justify-between mt-2 break-all">
              <span>
                Ingest URL:
                <br />
                rtmp://rtmp.livepeer.com/live/
              </span>
              <ConnectButton
                onClick={() =>
                  copyTextToClipboard(`rtmp://rtmp.livepeer.com/live/`)
                }
              >
                Copy
              </ConnectButton>
            </div>
            <div className="flex items-center justify-between mt-2 break-all mb-6">
              <span>
                Stream Key:
                <br />
                {streamKey}
              </span>
              <ConnectButton onClick={() => copyTextToClipboard(streamKey)}>
                Copy
              </ConnectButton>
            </div>
            <div className="flex items-center justify-between mt-2 break-all mb-6">
              <span>
                Stream Playback URL:
                <br />
                {`https://d-stream.vercel.app/livestream/${playbackId}`}
              </span>
              <ConnectButton
                onClick={() =>
                  copyTextToClipboard(
                    `https://d-stream.vercel.app/livestream/${playbackId}`
                  )
                }
              >
                Copy
              </ConnectButton>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ConnectButton onClick={() => exitStream()}>
              End stream
            </ConnectButton>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const ConnectButton = styled.button`
  /* padding: 12px; */
  border: 0;
  cursor: pointer;

  color: #fff;
  font-weight: 100;
  padding: 8px 16px;
  background-image: linear-gradient(45deg, #f303c9, #3d309b);
  border: 0;
  margin-right: 12px;
  margin-top: 12px;
  border-radius: 8px;
`;

const Search = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 12px;
  div {
    /* position: fixed; */
    /* right: 24px; */
    height: 36px !important;
    display: flex;
    align-items: center;
    top: 24px;
    span {
      margin-left: 12px;
    }
  }
  input {
    width: 430px;
    background-color: #353440;
    border: 0;
    padding: 6px 12px;
    border-radius: 6px;
    color: #808191;
    :focus {
      outline: none;
    }
  }
`;

export default LivestreamBody;

import React from "react";
import {
  createStream,
  getStreamStatus,
} from "../../services/livepeerStreamHelper";
import SideBar from "../../components/SideBar";
import styled from "styled-components";
import LivestreamBody from "../../components/livestreamBody";
const STORAGE_KEY = "ls-state";

enum APP_STATES {
  CREATE_BUTTON = 1,
  CREATING_STREAM = 2,
  WAITING_FOR_VIDEO = 3,
  SHOW_VIDEO = 4,
}
const INITIAL_STATE = {
  appState: APP_STATES.CREATE_BUTTON,
  streamId: null,
  playbackId: null,
  streamKey: null,
  streamIsActive: false,
  error: null,
};

function initState() {
  const stringState = localStorage.getItem(STORAGE_KEY);
  if (stringState) {
    try {
      return JSON.parse(stringState);
    } catch (error) {
      return INITIAL_STATE;
    }
  } else {
    return INITIAL_STATE;
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case "RELOAD_STATE":
      const newState = initState();
      return newState;
    case "SUBMIT_API_KEY":
      return {
        ...state,
        appState: APP_STATES.CREATE_BUTTON,
        apiKey: action.payload.apiKey,
      };
    case "CREATE_CLICKED":
      return {
        ...state,
        appState: APP_STATES.CREATING_STREAM,
      };
    case "STREAM_CREATED":
      return {
        ...state,
        appState: APP_STATES.WAITING_FOR_VIDEO,
        streamId: action.payload.streamId,
        playbackId: action.payload.playbackId,
        streamKey: action.payload.streamKey,
      };
    case "VIDEO_STARTED":
      return {
        ...state,
        appState: APP_STATES.SHOW_VIDEO,
        streamIsActive: true,
      };
    case "VIDEO_STOPPED":
      return {
        ...state,
        appState: APP_STATES.WAITING_FOR_VIDEO,
        streamIsActive: false,
      };
    case "RESET_DEMO_CLICKED":
      return {
        appState: APP_STATES.CREATE_BUTTON,
        apiKey: "1f31d661-306b-4d45-8af4-faf3597df067",
        streamId: null,
        playbackId: null,
        streamKey: null,
        streamIsActive: false,
        error: null,
      };
    case "INVALID_API_KEY":
      return {
        ...state,
        error: action.payload.message,
      };
    default:
      break;
  }
};

export default function LiveStream() {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  React.useEffect(() => {
    dispatch({ type: "RELOAD_STATE" });
  }, []);

  React.useEffect(() => {
    if (state) {
      const stringifiedState = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, stringifiedState);
    }
  }, [state]);

  React.useEffect(() => {
    if (state.appState === APP_STATES.CREATING_STREAM) {
      (async function () {
        try {
          const streamCreateResponse = await createStream();
          if (streamCreateResponse.data) {
            const {
              id: streamId,
              playbackId,
              streamKey,
            } = streamCreateResponse.data;
            dispatch({
              type: "STREAM_CREATED",
              payload: {
                streamId,
                playbackId,
                streamKey,
              },
            });
          }
        } catch (error) {
          if (error.response.status === 403) {
            dispatch({
              type: "INVALID_API_KEY",
              payload: {
                message:
                  "Invalid API Key. Please try again with right API key!",
              },
            });
          } else {
            dispatch({
              type: "INVALID_API_KEY",
              payload: {
                message:
                  "Something went wrong! Please try again after sometime",
              },
            });
          }
        }
      })();
    }

    let interval;
    if (state.streamId) {
      interval = setInterval(async () => {
        const streamStatusResponse = await getStreamStatus(state.streamId);
        if (streamStatusResponse.data) {
          const { isActive } = streamStatusResponse.data;
          dispatch({
            type: isActive ? "VIDEO_STARTED" : "VIDEO_STOPPED",
          });
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [state.appState]);

  return (
    <Container>
      <SideBar min={true} />
      <h1>Livestream</h1>
      <span>Decentralised livestreaming platform</span>
      <Contents>
        {/* <span>Coming soon.</span> */}
        <LivestreamBody
          state={state}
          createStream={() => dispatch({ type: "CREATE_CLICKED" })}
          exitStream={() => dispatch({ type: "RESET_DEMO_CLICKED" })}
        />
      </Contents>
    </Container>
  );
}

const Container = styled.div`
  padding: 24px;
  margin-left: 100px;

  height: 100vh;
  h1 {
    color: #fff;
    margin-bottom: 0;
  }
  span {
    color: #808191;
  }
`;

const Contents = styled.div`
  display: flex;
  grid-gap: 48px;
  flex-wrap: wrap;
  margin-top: 54px;
  justify-content: center;
  width: 100%;
  span {
    /* text-align: center; */
  }
`;

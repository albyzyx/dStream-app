import axios from "axios";

const API_key = "1f31d661-306b-4d45-8af4-faf3597df067";
const apiInstance = axios.create({
  baseURL: "/api/",
  timeout: 10000,
});

export const createStream = (): Promise<any> => {
  return apiInstance.post(
    "/stream",
    {
      name: "test_stream",
      profiles: [
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720,
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480,
        },
        {
          name: "360p",
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360,
        },
      ],
    },
    {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${API_key}`,
      },
    }
  );
};

export const getStreamStatus = (streamId: string): Promise<any> => {
  return apiInstance.get(`/stream/${streamId}`, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${API_key}`,
    },
  });
};

import axios from "axios";

/**
 * calls the /stream route of Livepeer.com APIs to create a new stream.
 * The response returns the playbackId and streamKey.
 * With this data available the ingest and playback urls would respectively be:
 * Ingest URL: rtmp://rtmp.livepeer.com/live/{stream-key}
 * Playback URL: https://cdn.livepeer.com/hls/{playbackId}/index.m3u8
 */
export default async (req, res) => {
  if (req.method === "POST") {
    const authorizationHeader = req.headers && req.headers["authorization"];
    const name = req.body && req.body.name;

    try {
      const createStreamResponse = await axios.post(
        "https://livepeer.studio/api/asset/request-upload",
        {
          name,
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: authorizationHeader, // API Key needs to be passed as a header
          },
        }
      );
      res.json(createStreamResponse.data);
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  }
};

import axios from "axios";

/**
 * calls the /stream/<id> route of Livepeer.com APIs to get the stream's status to verify that the stream is live or not.
 * isActive: true means video segments are currently being ingested by Livepeer.com. isActive: false means the live stream is idle and no
 * video segments are currently being ingested by Livepeer.com.
 */
export default async (req, res) => {
  console.log("HERe");
  if (req.method === "GET") {
    const authorizationHeader = req.headers && req.headers["authorization"];
    const taskID = req.query.taskID;
    console.log({ taskID });
    try {
      const resp = await axios.get(
        `https://livepeer.studio/api/task/${taskID}`,
        {
          headers: {
            "content-type": "application/json",
            authorization: authorizationHeader, // API Key needs to be passed as a header
          },
        }
      );
      res.json(resp.data);
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  }
};

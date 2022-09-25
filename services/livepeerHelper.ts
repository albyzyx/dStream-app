import { NFTStorage, File, Blob } from "nft.storage";
import { Web3Storage } from "web3.storage";
import axios from "axios";
import webp from "webp-converter";

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUyY0E4ZEJkRTM2NTEyMWE0MDVGMzE3OTA4MzFmMDNDNzEzOTc0ZTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODM0OTc3NDQzMiwibmFtZSI6ImQtc3RyZWFtIn0.fOS4iyWII5kxFEVSz3gEV0_jrQ3IBY85i8nD00huTKM";

const WEB3S_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkwNzllQ0UxMTAyYTdBNWFmQkYzMmVlNjM2NDBkMjIwNzI5MDkwMzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTA3MzA4NTYzMzAsIm5hbWUiOiJpbnNjcmlwdC1kZXYifQ.__T_SdRAju6XzOrIwZr6zcG2T53oJ2WfoCI89mzsqy4";

const nftsClient = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const web3Client = new Web3Storage({ token: WEB3S_STORAGE_TOKEN });

const API_key = "1f31d661-306b-4d45-8af4-faf3597df067";

const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer 1f31d661-306b-4d45-8af4-faf3597df067",
};

const apiInstance = axios.create({
  baseURL: "/api/",
  timeout: 10000,
});

const uploadPreviewImageToIPFS = async (imageBlobURL) => {
  let blob = await fetch(imageBlobURL).then((r) => r.blob());
  const cid = await nftsClient.storeBlob(blob);
  return cid;
};

const uploadJSONToIPFS = async (json) => {
  console.log("uploadJSONToIPFS", json);
  const blob = new Blob([JSON.stringify(json)], {
    type: "application/json",
  });
  const cid = await nftsClient.storeBlob(blob);
  console.log(cid);
  return cid;
};

const getUploadLink = async (fileName: string) => {
  let res = await apiInstance.post(
    "/asset/request-upload",
    {
      name: fileName,
    },
    {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${API_key}`,
      },
    }
  );
  const assetURL = res.data.url;
  const assetID = res.data.asset.id;
  const taskID = res.data.task.id;
  return { assetURL, assetID, taskID };
};

const uploadFileToLink = async (
  assetURL: string,
  file: any,
  statusCallback: Function
) => {
  await axios.put(assetURL, file, {
    headers: {
      "Content-Type": "video/mp4",
    },
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      statusCallback("Video uploaded: " + percentCompleted + "%");
    },
  });
};

const checkTaskStatus = async (taskID: string) => {
  const res = await apiInstance.get(`/task/${taskID}`, {
    headers,
  });
  return res.data.status.phase === "completed";
};

const exportAssetToIPFS = async (assetID, description, previewCID) => {
  let res = await apiInstance.post(
    `/asset/${assetID}/export`,
    {
      ipfs: {
        nftMetadata: {
          description: description,
          image: "ipfs://" + previewCID,
        },
      },
    },
    { headers }
  );
  return res.data.task.id;
};

const getIpfsMetaFromTask = async (taskID) => {
  const res = await apiInstance.get(`/task/${taskID}`, {
    headers,
  });
  return res.data.output.export.ipfs.nftMetadataUrl;
};

export const uploadVideoToIPFS = async (
  fileName: string,
  description: string,
  previewImageURL: string,
  file: any,
  statusCallback: Function
) => {
  statusCallback("Preparing video upload");
  statusCallback("Uploading preview image");
  const previewImageCID = await uploadPreviewImageToIPFS(previewImageURL);

  statusCallback("Uploading video to IPFS");
  const videoCID = await uploadPreviewImageToIPFS(previewImageURL);

  const target = {
    animation_url: "ipfs://" + videoCID,
    description: description,
    image: "ipfs://" + previewImageCID,
    name: fileName,
    properties: {
      video: "ipfs://" + videoCID,
    },
  };

  const targetCid = await uploadJSONToIPFS(target);

  statusCallback("Finishing");

  console.log({ targetCid });

  // const { assetURL, assetID, taskID } = await getUploadLink(fileName);
  // console.log({ assetURL, assetID, taskID });
  // statusCallback("Uploading video");
  // await uploadFileToLink(assetURL, file, statusCallback);

  // let isFileUploaded = await checkTaskStatus(taskID);
  // while (!isFileUploaded) {
  //   await new Promise((r) => setTimeout(r, 2000));
  //   isFileUploaded = await checkTaskStatus(taskID);
  //   console.log(isFileUploaded);
  // }
  // statusCallback("Exporting video to IPFS");

  // const ipfsTaskId = await exportAssetToIPFS(
  //   assetID,
  //   description,
  //   previewImageCID
  // );
  // let fileExported = await checkTaskStatus(ipfsTaskId);
  // while (!fileExported) {
  //   await new Promise((r) => setTimeout(r, 2000));
  //   fileExported = await checkTaskStatus(ipfsTaskId);
  // }
  // statusCallback("Video exported to IPFS");

  // const res = await getIpfsMetaFromTask(ipfsTaskId);
  return "ipfs://" + targetCid;
};

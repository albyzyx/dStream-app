import Web3Modal from "web3modal";
import axios from "axios";
import { BigNumber, ethers } from "ethers";

import DStream from "../artifacts/contracts/DStream.sol/DStream.json";

import { dStreamAddress } from "../config";
import { fetchIPFSLivePeer, fetchIPFSio } from "./ipfsHelper";
import { uploadVideoToIPFS } from "./livepeerHelper";

// export const setEventListner = async (callback) => {
//   const web3Modal = new Web3Modal();
//   const connection = await web3Modal.connect();
//   const provider = new ethers.providers.Web3Provider(connection);
//   const signer = provider.getSigner();

//   const contract = new ethers.Contract(dStreamAddress, DStream.abi, signer);
//   const videoEmitEvent = contract.videoItemUploaded();
//   videoEmitEvent.get();
// };
export async function getAddress() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return address;
}
async function getContract() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(dStreamAddress, DStream.abi, signer);
  return contract;
}

export async function createVideoNFT(
  fileName: string,
  description: string,
  previewImageURL: string,
  file: any,
  statusCallback: Function
) {
  const url = await uploadVideoToIPFS(
    fileName,
    description,
    previewImageURL,
    file,
    statusCallback
  );
  statusCallback("Signing contract");
  const contract = await getContract();
  statusCallback("Awaiting user confirmation...");
  const transaction = await contract.createToken(url);
  statusCallback("Minting NFT");
  await transaction.wait();
  statusCallback("NFT minted");
}

export async function fetchAllVideosWithMarketData() {
  const contract = await getContract();
  const data = await contract.fetchAllVideosWithMarketData();
  let items = await Promise.all(
    data.map(async (i) => {
      const tokenUri = fetchIPFSio(await contract.tokenURI(i.tokenId));
      const meta = await (await axios.get(tokenUri)).data;
      if (meta.properties && meta.properties.video) {
        const item = {
          tokenId: i.tokenId.toNumber(),
          author: i.author,
          owner: i.owner,
          isMarketItem: i.isMarketItem,
          seller: i.seller,
          price: ethers.utils.formatEther(i.price),
          title: meta.name,
          description: meta.description,
          previewImageURI: fetchIPFSio(meta.image),
          videoURI: fetchIPFSio(meta.properties.video),
          videoCID: meta.properties.video.split("/").at(-1),
          metaCID: tokenUri.split("/").at(-1),
        };
        return item;
      }
    })
  );

  items = items.filter(function (element) {
    return element !== undefined;
  });
  items.sort((a, b) => {
    return b.tokenId - a.tokenId;
  });

  return items;
}
export async function fetchAllMarketplaceVideos() {
  // const contract = await getContract();
  // const data = await contract.fetchAllMarketplaceVideos();
  // const items = await Promise.all(
  //   data.map(async (i) => {
  //     const tokenUri = fetchIPFSLivePeer(await contract.tokenURI(i.tokenId));
  //     const meta = await (await axios.get(tokenUri)).data;
  //     const item = {
  //       tokenId: i.tokenId.toNumber(),
  //       author: i.author,
  //       owner: i.owner,
  //       isMarketItem: i.isMarketItem,
  //       seller: i.seller,
  //       price: ethers.utils.formatEther(i.price),
  //       title: meta.name,
  //       description: meta.description,
  //       previewImageURI: fetchIPFSio(meta.image),
  //       videoURI: fetchIPFSLivePeer(meta.properties.video),
  //       videoCID: meta.properties.video.split("/").at(-1),
  //       metaCID: tokenUri.split("/").at(-1),
  //     };
  //     return item;
  //   })
  // );
  let items = await fetchAllVideosWithMarketData();
  items = items.filter((el) => el.isMarketItem);
  items.sort((a, b) => {
    return b.tokenId - a.tokenId;
  });
  return items;
}

export async function fetchAllAddressVideos(address: string, tokenId) {
  // const contract = await getContract();
  // const data = await contract.fetchAllAddressVideos(address);
  // const items = await Promise.all(
  //   data.map(async (i) => {
  //     const tokenUri = fetchIPFSLivePeer(await contract.tokenURI(i.tokenId));
  //     const meta = await (await axios.get(tokenUri)).data;
  //     const item = {
  //       tokenId: i.tokenId.toNumber(),
  //       author: i.author,
  //       owner: i.owner,
  //       isMarketItem: i.isMarketItem,
  //       seller: i.seller,
  //       price: ethers.utils.formatEther(i.price),
  //       title: meta.name,
  //       description: meta.description,
  //       previewImageURI: fetchIPFSio(meta.image),
  //       videoURI: fetchIPFSLivePeer(meta.properties.video),
  //       videoCID: meta.properties.video.split("/").at(-1),
  //       metaCID: tokenUri.split("/").at(-1),
  //     };
  //     return item;
  //   })
  // );
  let items = await fetchAllVideosWithMarketData();
  items = items.filter((el) => {
    return el.owner == address;
  });
  items.sort((a, b) => {
    return b.tokenId - a.tokenId;
  });
  return items;
}
export async function fetchAllSenderVideos() {
  // const contract = await getContract();
  // const data = await contract.fetchAllSenderVideos();
  // const items = await Promise.all(
  //   data.map(async (i) => {
  //     const tokenUri = fetchIPFSLivePeer(await contract.tokenURI(i.tokenId));
  //     const meta = await (await axios.get(tokenUri)).data;
  //     const item = {
  //       tokenId: i.tokenId.toNumber(),
  //       author: i.author,
  //       owner: i.owner,
  //       isMarketItem: i.isMarketItem,
  //       seller: i.seller,
  //       price: ethers.utils.formatEther(i.price),
  //       title: meta.name,
  //       description: meta.description,
  //       previewImageURI: fetchIPFSio(meta.image),
  //       videoURI: fetchIPFSLivePeer(meta.properties.video),
  //       videoCID: meta.properties.video.split("/").at(-1),
  //       metaCID: tokenUri.split("/").at(-1),
  //     };
  //     return item;
  //   })
  // );

  let items = await fetchAllVideosWithMarketData();
  const address = await getAddress();
  items = items.filter((el) => el.owner == address);
  items.sort((a, b) => {
    return b.tokenId - a.tokenId;
  });
  return items;
}
export async function fetchTokenMeta(tokenId: BigNumber) {
  const contract = await getContract();
  const data = await contract.getVideoItem(tokenId);
  const tokenUri = fetchIPFSio(await contract.tokenURI(data.tokenId));
  const meta = await (await axios.get(tokenUri)).data;
  const item = {
    tokenId: data.tokenId.toNumber(),
    author: data.author,
    owner: data.owner,
    isMarketItem: data.isMarketItem,
    seller: data.seller,
    price: data.isMarketItem ? ethers.utils.formatEther(data.price) : 0,
    title: meta.name,
    description: meta.description,
    previewImageURI: fetchIPFSio(meta.image),
    videoURI: fetchIPFSio(meta.properties.video),
    videoCID: meta.properties.video.split("/").at(-1),
    metaCID: tokenUri.split("/").at(-1),
  };
  return item;
}

export async function listTokenInMarket(tokenId: BigNumber, price: string) {
  const contract = await getContract();
  const priceInEther = ethers.utils.parseUnits(price, "ether");
  const listingPrice = await contract.getListingPrice();
  const transaction = await contract.listTokenInMarket(tokenId, priceInEther, {
    value: listingPrice,
  });
  const transactionReceipt = await transaction.wait();
  // const resTokenId = transactionReceipt.events[2].args.tokenId.toNumber();
  const resSeller = transactionReceipt.events[2].args.seller;

  return { tokenId, resSeller, price };
}
export async function createMarketSale(tokenId: BigNumber, itemPrice: string) {
  const contract = await getContract();
  const priceInEther = ethers.utils.parseUnits(itemPrice, "ether");
  const transaction = await contract.createMarketSale(tokenId, {
    value: priceInEther,
  });
  await transaction.wait();
}

// export async function fetchVideoMeta(metaCID) {
//   const tokenUri = fetchIpfsResourceURI(metaCID);
//   const meta = await (await axios.get(tokenUri)).data;
//   let item = {
//     tokenId: i.tokenId.toNumber(),
//     seller: i.author,
//     title: meta.name,
//     description: meta.description,
//     previewImageURI: fetchIpfsResourceURI(meta.image),
//     videoURI: fetchIpfsResourceURI(meta.properties.video),
//     videoCID: meta.properties.video.split("/").at(-1),
//     metaCID: tokenUri.split("/").at(-1),
//   };
//   return item;
// }

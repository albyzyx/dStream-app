export const fetchIPFSio = (CID) => {
  return "https://ipfs.io/ipfs/" + CID.split("/").at(-1);
};

export const fetchIPFSLivePeer = (CID) => {
  return "https://ipfs.livepeer.com/ipfs/" + CID.split("/").at(-1);
};

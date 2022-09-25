import { web3Modal } from "../services/web3login";
import supportedChains from "./chains";
import { IChainData } from "./types";

export async function getChainData(chainId?: number) {
  if (!chainId) {
    return null;
  }

  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    // throw new Error("ChainId missing or not supported");
    if (!chainData) {
      const provider = await web3Modal.connect();

      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x13881",
            chainName: "Mumbai Testnet",
            rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
            blockExplorerUrls: ["https://polygonscan.com/"],
            nativeCurrency: {
              symbol: "MATIC",
              decimals: 18,
            },
          },
        ],
      });
    }
    return supportedChains[0];
  }

  return chainData;
}

export function ellipseAddress(address = "", width = 10): string {
  if (!address) {
    return "";
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

import { IChainData } from "./types";

const supportedChains: IChainData[] = [
  {
    name: "Mumbai Testnet",
    short_name: "Polygon",
    chain: "MATIC",
    network: "testnet",
    chain_id: 80001,
    network_id: 1,
    rpc_url: "https://rpc-mumbai.maticvigil.com",
    native_currency: {
      symbol: "MATIC",
      name: "MATIC",
      decimals: "18",
      contractAddress: "",
      balance: "",
    },
  },
];

export default supportedChains;

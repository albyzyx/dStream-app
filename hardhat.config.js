require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const fs = require("fs");
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
  defaultNetwork: "matic",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privateKey],
      gas: 210000000,
      gasPrice: 8000000000,
    },
  },
  etherscan: {
    apiKey: "V5S89Z8SAHTGM45ZNG6PWNG6QC1K8KT6HM",
  },
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

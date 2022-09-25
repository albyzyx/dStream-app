const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const DStream = await hre.ethers.getContractFactory("DStream");
  const dStream = await DStream.deploy();
  await dStream.deployed();
  console.log("dStream deployed to:", dStream.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const dStreamAddress = "${dStream.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

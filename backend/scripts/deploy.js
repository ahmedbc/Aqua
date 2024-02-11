// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deployAqETHTokenContract() {

  console.log(`Start deploying  AQT Token...`);

  const aqETH = await hre.ethers.deployContract("AqETH");
  await aqETH.waitForDeployment();

  return aqETH.target;
  console.log(`AqETH contract is deployed to ${aqETH.target}`);
}

async function deployAquaContract(aqETHAddress) {

  console.log(`Start deploying  Aqua staking contract...`, aqETHAddress);

  const aqua = await hre.ethers.deployContract("Aqua", [aqETHAddress]);
  await aqua.waitForDeployment();

  console.log(`Aqua contract is deployed to ${aqua.target}`);
}

async function main() {

  const aqETHAddress = await deployAqETHTokenContract();

  await deployAquaContract(aqETHAddress);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

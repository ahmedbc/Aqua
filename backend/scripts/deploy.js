const hre = require("hardhat");

async function deployAqETHTokenContract() {

  console.log(`Start deploying  AQT Token...`);

  const aqETH = await hre.ethers.deployContract("AqETH");
  await aqETH.waitForDeployment();
  
  console.log(`AqETH contract is deployed to ${aqETH.target}`);

  return aqETH;
}

async function deployAquaContract() {

  console.log(`Start deploying  Aqua staking contract...`);

  const aqua = await hre.ethers.deployContract("Aqua");
  await aqua.waitForDeployment();

  console.log(`Aqua contract is deployed to ${aqua.target}`);

  return aqua;
}

async function main() {


  const aqua = await deployAquaContract();
  const assetStep = ethers.parseEther("10000");
  aqua.setRateDecreaseStep(assetStep);
  aqua.setRateDecreasePerStep(1);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

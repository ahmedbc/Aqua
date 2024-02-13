const hre = require("hardhat");

async function deployAqETHTokenContract() {

  console.log(`Start deploying  AQT Token...`);

  const aqETH = await hre.ethers.deployContract("AqETH");
  await aqETH.waitForDeployment();
  
  console.log(`AqETH contract is deployed to ${aqETH.target}`);

  return aqETH;
}

async function deployAquaContract(aqETHAddress) {

  console.log(`Start deploying  Aqua staking contract...`, aqETHAddress);

  const aqua = await hre.ethers.deployContract("Aqua", [aqETHAddress]);
  await aqua.waitForDeployment();

  console.log(`Aqua contract is deployed to ${aqua.target}`);

  return aqua;
}

async function main() {

  const aqETH = await deployAqETHTokenContract();

  const aqua = await deployAquaContract(aqETH.target);
  
  // Grant Roles for the Aqua Staking contract
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  await aqETH.grantRole(MINTER_ROLE, aqua.target);
  const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));
  await aqETH.grantRole(BURNER_ROLE, aqua.target);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  solidity: "0.8.23",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337
    },
    sepolia: {
      url: ALCHEMY_RPC_URL,
      accounts: [`${PRIVATE_KEY}`],
      chainId: 11155111
    }
  },
};

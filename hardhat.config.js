require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

let { privateKey, alchemyUrl, ftmscanApiKey } = require("./secrets.json");

module.exports = {
  solidity: "0.8.7",
  networks: {
    fantom: {
      url: alchemyUrl,
      accounts: [privateKey]
    }
  },
  etherscan: {
    apiKey: ftmscanApiKey
  },
  gasReporter: {
    excludeContracts: [""]
  }
};

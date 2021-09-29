require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

let { privateKey, rpc, ftmscanApiKey } = require("./secrets.json");

module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: rpc,
        timeout: 200000
      }
    },
    fantom: {
      url: rpc,
      accounts: [privateKey]
    }
  },
  etherscan: {
    apiKey: ftmscanApiKey
  },
  gasReporter: {
    excludeContracts: ["contracts/mocks/"]
  }
};

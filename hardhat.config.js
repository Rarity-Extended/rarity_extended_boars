require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
// require("hardhat-gas-reporter");

let { privateKey, rpc, ftmscanApiKey } = require("./secrets.json");

module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
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
        url: 'https://rpc.ftm.tools',
      }
    },
    localhost: {
      url: "http://localhost:8545",
      timeout: 2000000000,
      accounts: [privateKey]
    },
    fantom: {
      chainId: 250,
      url: 'https://rpc.ftm.tools',
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

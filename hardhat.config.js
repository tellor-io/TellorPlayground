//require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 300
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      hardfork: process.env.CODE_COVERAGE ? "berlin" : "london",
      initialBaseFeePerGas: 0,
      accounts: {
        mnemonic:
          "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
        count: 40,
      },
      // forking: {
      //   url: "https://eth-mainnet.alchemyapi.io/v2/7dW8KCqWwKa1vdaitq-SxmKfxWZ4yPG6"
      // },
      allowUnlimitedContractSize: true
    },
    rinkeby: {
         url: `${process.env.NODE_URL_RINKEBY}`,
         seeds: [process.env.TESTNET_PK],
         gas: 10000000,
         gasPrice: 40000000000
    }//,
      // mainnet: {
      //   url: `${process.env.NODE_URL_MAINNET}`,
      //   accounts: [process.env.PRIVATE_KEY],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // }
      // ropsten: {
      //   url: `${process.env.NODE_URL_ROPSTEN}`,
      //   accounts: [process.env.TESTNET_PK],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // }
      // kovan: {
      //   url: `${process.env.NODE_URL_KOVAN}`,
      //   accounts: [process.env.TESTNET_PK],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // }
      // goerli: {
      //   url: `${process.env.NODE_URL_GOERLI}`,
      //   accounts: [process.env.TESTNET_PK],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // }
      // bsc_testnet: {
      //   url: `${process.env.NODE_URL_BSC_TESTNET}`,
      //   accounts: [process.env.TESTNET_PK],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // }
      // polygon_testnet: {
      //   url: `${process.env.NODE_URL_MUMBAI}`,
      //   accounts: [process.env.TESTNET_PK],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // }
      // arbitrum_testnet: {
      //   url: `${process.env.NODE_URL_ARBITRUM_TESTNET}`,
      //   accounts: [process.env.TESTNET_PK],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

}

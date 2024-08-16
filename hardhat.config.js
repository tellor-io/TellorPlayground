/** @type import('hardhat/config').HardhatUserConfig */
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
      },
      {
        version: "0.6.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100
          }
        }
      },
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      // hardfork: process.env.CODE_COVERAGE ? "berlin" : "london",
      // initialBaseFeePerGas: 0,
      // accounts: {
      //   mnemonic:
      //     "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
      //   count: 40,
      // },
      forking: {
        url : "https://eth-mainnet.alchemyapi.io/v2/hP3lNPFpxPSwfwJtfaZi4ezZlPgimAnN", // mainnet
        // url: "https://eth-goerli.alchemyapi.io/v2/I-BlqR7R6s5-Skel3lnCwJzamDbmXHLF", // Goerli
        // blockNumber:  // rinkeby
      },
      allowUnlimitedContractSize: true
    },
    goerli: {
      url: `${process.env.NODE_URL_GOERLI}`,
      accounts: [process.env.TESTNET_PK],
      gas: 10000000 ,
      gasPrice: 50000000000
    },
      // mainnet: {
      //   url: `${process.env.NODE_URL_MAINNET}`,
      //   accounts: [process.env.PRIVATE_KEY],
      //   gas: 10000000 ,
      //   gasPrice: 50000000000
      // },
   mumbai: {
        url: `${process.env.NODE_URL_MUMBAI}`,
        accounts: [process.env.TESTNET_PK],
        gas: 5000000 ,
        gasPrice: 50000000000
      },
      tfilecoin: {
        url: `${process.env.NODE_URL_FILECOIN_TESTNET}`,
        accounts: [process.env.TESTNET_PK],
        gas: 10000000 ,
        gasPrice: 20000000000
      },
      filecoin: {
        url: `${process.env.NODE_URL_FILECOIN}`,
        accounts: [process.env.TESTNET_PK],
        gas: 10000000 ,
        gasPrice: 20000000000
      },


    // polygon: {
    //   url: `${process.env.NODE_URL_MATIC}`,
    //   accounts: [process.env.PRIVATE_KEY],
    //   gas: 5000000 ,
    //   gasPrice: 250000000000
 
      //maxPriorityFeePerGas: ,
      //maxFeePerGas: 
    // },
    chiado: {
      url: `${process.env.NODE_URL_CHIADO}`,
      accounts: [process.env.TESTNET_PK],
      gas: 5000000 ,
      gasPrice: 50000000000
    } ,
    gnosis: {
      url: `${process.env.NODE_URL_GNOSIS}`,
      accounts: [process.env.TESTNET_PK],
      gas: 5000000 ,
      gasPrice: 5000000000
    } ,
    arbitrum_testnet: {
      url: `${process.env.NODE_URL_ARBITRUM_TESTNET}`,
      accounts: [process.env.TESTNET_PK],
      gas: 10000000 ,
      gasPrice: 50000000000
    },
    sepolia: {
      url: `${process.env.NODE_URL_SEPOLIA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 9000000 ,
      gasPrice: 5000000000
    },
    manta_testnet: {
      url: `${process.env.NODE_URL_MANTA_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000000
    },
    mantle_testnet: {
      url: `${process.env.NODE_URL_MANTLE_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000000
    },
    zkevm_testnet: {
      url: `${process.env.NODE_URL_ZKEVM_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000000
    } ,
    zkevm: {
      url: `${process.env.NODE_URL_ZKEVM_POLYGON}`,
      seeds: [process.env.TESTNET_PK]
    },
    linea_testnet: {
      url: `${process.env.NODE_URL_LINEA_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000000
    },
    linea: {
      url: `${process.env.NODE_URL_LINEA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000000
    },  
    holesky: {
      url: `${process.env.NODE_URL_HOLESKY}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 10000000000
    },
    europa_testnet: {
      url: `${process.env.NODE_URL_SKALE_EUROPA_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 10000000000
    }, 
    europa: {
      url: `${process.env.NODE_URL_SKALE_EUROPA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 10000000000
    },
    kyoto_testnet:      {
      url: `${process.env.NODE_URL_KYOTO_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 10000000000
    },
    polygon_amoy: {
      url: `${process.env.NODE_URL_POLYGON_AMOY}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 10000000000
    },
    optimism_sepolia: {
      url: `${process.env.NODE_URL_OPTIMISM_SEPOLIA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 10000000000
    },
    arbitrum_sepolia: {
      url: `${process.env.NODE_URL_ARBITRUM_SEPOLIA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 10000000000
    },
    mantle_sepolia: {
      url: `${process.env.NODE_URL_MANTLE_SEPOLIA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000000
    } ,
    base_sepolia: {
      url: `${process.env.NODE_URL_BASE_SEPOLIA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000
    } ,
    mode_testnet: {
      url: `${process.env.NODE_URL_MODE_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000
    },
    mode: {
      url: `${process.env.NODE_URL_MODE_MAINNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000
    } ,
    rari_testnet: {
      url: `${process.env.NODE_URL_RARI_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 100000000
    } ,

    telos_testnet: {
      url: `${process.env.NODE_URL_TELOS_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 6000000000
    }    
    ,
    atleta_testnet: {
      url: `${process.env.NODE_URL_ATLETA_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 200000000
    }  ,
    telos: {
      url: `${process.env.NODE_URL_TELOS}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 6000000000
    }  ,
    taraxa_testnet: {
      url: `${process.env.NODE_URL_TARAXA_TESTNET}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 6000000000
    },
    bob_sepolia: {
      url: `${process.env.NODE_URL_BOB_SEPOLIA}`,
      seeds: [process.env.TESTNET_PK],
      gas: 8000000 ,
      gasPrice: 1000000000
    }           
   


    

  },
  // etherscan: {
  //   // Your API key for Etherscan
  //   // Obtain one at https://etherscan.io/
  //   //apiKey: process.env.ETHERSCAN
  //   //apiKey: process.env.POLYSCAN
  //   apiKey: process.env.ETHERSCAN
  // },

  etherscan: {
    apiKey: {
       // Your API key for Etherscan
   // Obtain one at https://etherscan.io/
   //sepolia: process.env.ETHERSCAN
   //apiKey: process.env.POLYSCAN
   //apiKey: process.env.BSC_TOKEN
   //apiKey: process.env.OPTIMISMSCAN
   mantelTest: process.env.ETHERSCAN
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io"
        }
      },
      {
        network: "mantleTest",
        chainId: 5001,
        urls: {
        apiURL: "https://explorer.testnet.mantle.xyz/api",
        browserURL: "https://explorer.testnet.mantle.xyz"
        }
      }


    ]
  },



  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true               // Run the grep's inverse set.
  }

};

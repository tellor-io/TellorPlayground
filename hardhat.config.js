require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();


//Run this commands to deploy tellor playground:
//npx hardhat deploy --name "tellor" --symbol "TRB" --net rinkeby --network rinkeby
//npx hardhat deploy --name "tellor" --symbol "TRB" --net mainnet --network mainnet
//npx hardhat deploy --name tellor --symbol TRB --net bsc_testnet --network bsc_testnet
//npx hardhat deploy --name tellor --symbol TRB --net arbitrum --network arbitrum
//npx hardhat deploy --name tellor --symbol TRB --net arbitrum_testnet --network arbitrum_testnet
//npx hardhat deploy --name tellor --symbol TRB --net polygon --network polygon
//npx hardhat deploy --name tellor --symbol TRB --net polygon_testnet --network polygon_testnet
//npx hardhat deploy --name tellor --symbol TRB --net xdaiSokol --network xdaiSokol
//npx hardhat deploy --name tellor --symbol TRB --net xdai --network xdai

task("deploy", "Deploy and verify the contracts")
  .addParam("name", "coin name")
  .addParam("symbol", "coin symbol")
  .addParam("net", "network to deploy in")
  .setAction(async taskArgs => {


    console.log("deploy tellor playground with access")
    var name = taskArgs.name
    var symbol = taskArgs.symbol
    var net = taskArgs.network

    await run("compile");
    const Tellor = await ethers.getContractFactory("TellorPlayground");
    const tellor= await Tellor.deploy(name, symbol);
    console.log("Tellor deployed to:", tellor.address);
    await tellor.deployed();

    if (net == "mainnet"){
        console.log("Tellor contract deployed to:", "https://etherscan.io/address/" + tellor.address);
        console.log("    transaction hash:", "https://etherscan.io/tx/" + tellor.deployTransaction.hash);
    } else if (net == "rinkeby") {
        console.log("Tellor contract deployed to:", "https://rinkeby.etherscan.io/address/" + tellor.address);
        console.log("    transaction hash:", "https://rinkeby.etherscan.io/tx/" + tellor.deployTransaction.hash);
    } else if (net == "bsc_testnet") {
        console.log("Tellor contract deployed to:", "https://testnet.bscscan.com/address/" + tellor.address);
        console.log("    transaction hash:", "https://testnet.bscscan.com/tx/" + tellor.deployTransaction.hash);
    } else if (net == "bsc") {
        console.log("Tellor contract deployed to:", "https://bscscan.com/address/" + tellor.address);
        console.log("    transaction hash:", "https://bscscan.com/tx/" + tellor.deployTransaction.hash);
    } else if (net == "polygon") {
        console.log("Tellor contract deployed to:", "https://explorer-mainnet.maticvigil.com/" + tellor.address);
        console.log("    transaction hash:", "https://explorer-mainnet.maticvigil.com/tx/" + tellor.deployTransaction.hash);
    } else if (net == "polygon_testnet") {
        console.log("Tellor contract deployed to:", "https://explorer-mumbai.maticvigil.com/" + tellor.address);
        console.log("    transaction hash:", "https://explorer-mumbai.maticvigil.com/tx/" + tellor.deployTransaction.hash);
    } else if (net == "arbitrum_testnet"){
        console.log("tellor contract deployed to:","https://explorer.arbitrum.io/#/ "+ tellor.address)
        console.log("    transaction hash:", "https://explorer.arbitrum.io/#/tx/" + tellor.deployTransaction.hash);
    }  else if (net == "xdaiSokol"){ //https://blockscout.com/poa/xdai/address/
      console.log("tellor contract deployed to:","https://blockscout.com/poa/sokol/address/"+ tellor.address)
      console.log("    transaction hash:", "https://blockscout.com/poa/sokol/tx/" + tellor.deployTransaction.hash);
    } else if (net == "xdai"){ //https://blockscout.com/poa/xdai/address/
      console.log("tellor contract deployed to:","https://blockscout.com/xdai/mainnet/address/"+ tellor.address)
      console.log("    transaction hash:", "https://blockscout.com/xdai/mainnet/tx/" + tellor.deployTransaction.hash);
    } else {
        console.log("Please add network explorer details")
    }


    // Wait for few confirmed transactions.
    // Otherwise the etherscan api doesn't find the deployed contract.
    console.log('waiting for tx confirmation...');
    await tellor.deployTransaction.wait(3)

    console.log('submitting contract for verification...');

    await run("verify:verify", {
      address: tellor.address,
      constructorArguments: [name, symbol]
    },
    )

    console.log("Contract verified")

  });


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
        version: "0.7.4",
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
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/7dW8KCqWwKa1vdaitq-SxmKfxWZ4yPG6"
      },
      allowUnlimitedContractSize: true
    }//,
    //rinkeby: {
      //   url: `${process.env.NODE_URL_RINKEBY}`,
      //   accounts: [process.env.PRIVATE_KEY],
      //   gas: 10000000 ,
      //   gasPrice: 40000000000
    //},
      // mainnet: {
      //   url: `${process.env.NODE_URL_MAINNET}`,
      //   accounts: [process.env.PRIVATE_KEY],
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






/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
 solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 250
      }
    }
  },

  networks: {
    // hardhat: {
    //   accounts: {
    //     count: 40
    //   }
    // },
      rinkeby: {
        //url: "https://rinkeby.infura.io/v3/63ab6bb8ae4a4eedb2a55812e0a615a0" ,
        url: `${[process.env.NODE_URL_RINKEBY]}`,
        accounts: [process.env.TESTNET_PK],
        gas: 10000000 ,
        gasPrice: 110000000000
      } //,
      // // mainnet: {
      // //   url: `${process.env.NODE_URL_MAINNET}`,
      // //   accounts: [process.env.MAINNET_PK],
      // //   gas: 12000000 ,
      // //   gasPrice: 190000000000
      // // } ,
      // bsc_testnet: {
      //   url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      //   chainId: 97,
      //   gasPrice: 20000000000,
      //   accounts: [process.env.TESTNET_PK]
      // },
      // bsc: {
      //   url: "https://bsc-dataseed.binance.org/",
      //   chainId: 56,
      //   gasPrice: 20000000000,
      //   accounts: [process.env.MAINNET_PK]
      // } ,
      // polygon_testnet: {
      //   url: "https://rpc-mumbai.maticvigil.com/v1/" + process.env.MATIC_ACCESS_TOKEN,
      //   chainId: 80001,
      //   gasPrice: 20000000000,
      //   accounts: [process.env.TESTNET_PK]
      // } ,
      // polygon: {
      //   url: "https://rpc-mainnet.maticvigil.com/" + process.env.MATIC_ACCESS_TOKEN,
      //   chainId: 137,
      //   gasPrice: 20000000000,
      //   accounts: [process.env.MAINNET_PK]
      // } ,

  //     arbitrum_testnet: {
  //       url: "https://kovan4.arbitrum.io/rpc",
  //       //chainId: 212984383488152,
  //       gasPrice: 0,
  //       accounts: [process.env.TESTNET_PK]
  //     } ,

  //     xdai: {
  //       url: "https://dai.poa.network",
  //       //network_id: 100,
  //       gas: 3000000,
  //       gasPrice: 1000000000,
  //       accounts: [process.env.TESTNET_PK]
  //     },
  //     xdaiSokol: {
  //       url: "https://sokol.poa.network",
  //       //network_id: 77,
  //       gas: 3000000,
  //       gasPrice: 1000000000,
  //       accounts: [process.env.TESTNET_PK]
  //     }


 },
  
   etherscan: {
      //Your API key for Etherscan
      //Obtain one at https://etherscan.io/
      apiKey: process.env.ETHERSCAN
      //apiKey: process.env.BSC_API
    }, 

    contractSizer: {
      alphaSort: true,
      runOnCompile: true,
      disambiguatePaths: false,
    },
};

require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

//const dotenv = require('dotenv').config()


//npx hardhat run scripts/deploy.js --network holesky

async function deployPlayground(_network, _pk, _nodeURL) {

    console.log("deploy tellor playground")
    var net = _network

    await run("compile")

    //Connect to the network
    let privateKey = _pk;
    var provider = new ethers.providers.JsonRpcProvider(_nodeURL)
    let wallet = new ethers.Wallet(privateKey, provider);
    const Tellor = await ethers.getContractFactory("contracts/TellorPlayground.sol:TellorPlayground", wallet);
    var tellorWithSigner = await Tellor.connect(wallet);
    const tellor= await tellorWithSigner.deploy();
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
        console.log("tellor contract deployed to:","https://rinkeby-explorer.arbitrum.io/#/"+ tellor.address)
        console.log("    transaction hash:", "https://rinkeby-explorer.arbitrum.io/#/tx/" + tellor.deployTransaction.hash);
    }  else if (net == "xdaiSokol"){ //https://blockscout.com/poa/xdai/address/
      console.log("tellor contract deployed to:","https://blockscout.com/poa/sokol/address/"+ tellor.address)
      console.log("    transaction hash:", "https://blockscout.com/poa/sokol/tx/" + tellor.deployTransaction.hash);
    } else if (net == "xdai"){ //https://blockscout.com/poa/xdai/address/
      console.log("tellor contract deployed to:","https://blockscout.com/xdai/mainnet/address/"+ tellor.address)
      console.log("    transaction hash:", "https://blockscout.com/xdai/mainnet/tx/" + tellor.deployTransaction.hash);
    }  else if (net == "mantle_testnet"){ 
    console.log("tellor contract deployed to:","https://testnet.mantlescan.org/address/"+ tellor.address)
     }  else if (net == "zkevm_testnet"){ 
    console.log("tellor contract deployed to:","https://cardona-zkevm.polygonscan.com/address/"+ tellor.address)
}  else if (net == "linea"){ 
    console.log("tellor contract deployed to:","https://lineascan.build/address/"+ tellor.address)
     }  else if (net == "linea_testnet"){ 
    console.log("tellor contract deployed to:","https://goerli.lineascan.build/address/"+ tellor.address)
}  else if (net == "europa"){ 
    console.log("tellor contract deployed to:","https://elated-tan-skat.explorer.mainnet.skalenodes.com/address/"+ tellor.address)
     }  else if (net == "europa_testnet"){ 
    console.log("tellor contract deployed to:","https://juicy-low-small-testnet.explorer.testnet.skalenodes.com/address/"+ tellor.address)
}  else if (net == "holesky"){ 
    console.log("tellor contract deployed to:","https://holesky.etherscan.io/address/"+ tellor.address)
   
    }else {
        console.log("Please add network explorer details")
    }


    // Wait for few confirmed transactions.
    // Otherwise the etherscan api doesn't find the deployed contract.
    console.log('waiting for tx confirmation...');
    await tellor.deployTransaction.wait(3)

    console.log('submitting contract for verification...');
    try {
    await run("verify:verify", {
      address: tellor.address
    },
    )

    console.log("Contract verified")
     } catch (e) {
    console.log(e)
    }
  };

  deployPlayground("europa_testnet", process.env.TESTNET_PK, process.env.NODE_URL_SKALE_EUROPA_TESTNET)
    .then(() => process.exit(0))
    .catch(error => {
	  console.error(error);
	  process.exit(1);
  });

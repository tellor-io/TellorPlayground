import { deployContract } from "./utils";

//npx hardhat run deploy/deploy.ts --network zkSyncSepoliaTestnet

// An example of a basic deploy script
// It will deploy a contract to selected network
// as well as verify it on Block Explorer if possible for the network
async function deploy () {
  const contractArtifactName = "TellorPlayground";
  //const constructorArguments = ["2",5,6];
  //await deployContract(contractArtifactName, constructorArguments);
  console.log("before deployment")
  await deployContract(contractArtifactName,[]);
  console.log("deployed")
}

deploy( )
    .then(() => process.exit(0))
    .catch(error => {
	  console.error(error);
	  process.exit(1);
  });
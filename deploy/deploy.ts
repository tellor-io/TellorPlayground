import { deployContract } from "./utils";

// An example of a basic deploy script
// It will deploy a contract to selected network
// as well as verify it on Block Explorer if possible for the network
export default async function () {
  const contractArtifactName = "TellorPlayground";
  //const constructorArguments = ["2",5,6];
  //await deployContract(contractArtifactName, constructorArguments);
  await deployContract(contractArtifactName);
}
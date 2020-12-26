const TellorPlayground = artifacts.require("TellorPlayground");

module.exports = function (deployer) {
  deployer.deploy(TellorPlayground,"CentralizedPlayground","CTP");
};

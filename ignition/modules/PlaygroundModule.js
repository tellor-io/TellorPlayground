const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("Playground", (m) => {

    const tellorPlaygroundModule = m.contract("TellorPlayground");

    return { tellorPlaygroundModule };
  });
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FisherChainModule", (m) => {
  const fisherChain = m.contract("FisherChain");

  return { fisherChain };
});
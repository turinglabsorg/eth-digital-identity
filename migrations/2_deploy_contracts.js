const Ficos = artifacts.require("./DID.sol");

module.exports = async (deployer) => {
  await deployer.deploy(Ficos, { gas: 5000000 });
};

//@ts-check

const { network } = require("hardhat");
const verify = require("../utils/verify");
const { devChains } = require("../helper.config");

module.exports = async (hre) => {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  log("Deploying to " + network.name);
  const contract = await deploy("ToDo", {
    log: true,
    from: deployer,
    args: [],
    // @ts-ignore
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("App deployed");

  if (!devChains.includes(network.name) && process.env.API_KEY) {
    await verify(contract.address, []);
  }
};

module.exports.tags = ["all"];

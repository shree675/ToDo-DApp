const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

module.exports = async () => {
  if (process.env.UPDATE_FRONTEND) {
    await updateAddresses();
    await updateABI();
    console.log("Updated frontend constants");
  }
};

const updateAddresses = async () => {
  const contract = await ethers.getContract("ToDo");
  const chainId = network.config.chainId.toString();
  const PATH = path.join("frontend", "constants", "addresses.json");

  let contractAddresses = JSON.parse(fs.readFileSync(PATH, "utf8"));
  if (contractAddresses[chainId]) {
    contractAddresses[chainId].push(contract.address);
  } else {
    contractAddresses[chainId] = [contract.address];
  }

  fs.writeFileSync(PATH, JSON.stringify(contractAddresses));
};

const updateABI = async () => {
  const contract = await ethers.getContract("ToDo");
  const PATH = path.join("frontend", "constants", "abi.json");

  fs.writeFileSync(
    PATH,
    contract.interface.format(ethers.utils.FormatTypes.json)
  );
};

module.exports.tags = ["all", "frontend"];

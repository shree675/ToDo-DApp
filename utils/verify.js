//@ts-check

const hre = require("hardhat");

const verify = async (contract, args) => {
  try {
    await hre.run("verify:verify", {
      address: contract,
      constructorArguments: args,
    });
  } catch (err) {
    if (!err.message.includes("already verified")) {
      console.error(err.message);
      process.exitCode = 1;
    }
  }
};

module.exports = verify;

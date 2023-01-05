//@ts-check

const { devChains } = require("../../helper.config");
const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");

!devChains.includes(network.name)
  ? describe.skip
  : describe("ToDo", () => {
      let contract, deployer;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        contract = await ethers.getContract("ToDo", deployer);
      });

      describe("addTask", () => {
        it("should add a task to the current user", async () => {
          const string = "First task";

          const response = await contract.addTask(string);
          await response.wait(1);

          const tasksList = await contract.getTasks();

          assert.equal(tasksList.length, 1);
          assert.equal(tasksList[0].name, string);
        });
      });
    });

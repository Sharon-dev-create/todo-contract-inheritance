const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", await deployer.getAddress());

  const TodoContract = await ethers.getContractFactory("TodoContract");
  const todo = await TodoContract.deploy();
  await todo.deployed();

  console.log("TodoContract:", todo.address);

  if (process.env.DEPLOY_HELPER === "true") {
    const GetAllTodoContract = await ethers.getContractFactory(
      "GetAllTodoContract",
    );
    const helper = await GetAllTodoContract.deploy(todo.address);
    await helper.deployed();
    console.log("GetAllTodoContract:", helper.address);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

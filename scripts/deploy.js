const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", await deployer.getAddress());

  const TodoContract = await ethers.getContractFactory("TodoContract");
  const todo = await TodoContract.deploy();
  await todo.waitForDeployment();

  console.log("TodoContract:", await todo.getAddress());

  if (process.env.DEPLOY_HELPER === "true") {
    const GetAllTodoContract = await ethers.getContractFactory(
      "GetAllTodoContract",
    );
    const helper = await GetAllTodoContract.deploy(await todo.getAddress());
    await helper.waitForDeployment();
    console.log("GetAllTodoContract:", await helper.getAddress());
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

import { ethers } from "hardhat";

async function main() {
    const TodoContract = await ethers.getContractFactory("TodoContract");
    const todo = await TodoContract.deploy();
    await todo.waitForDeployment();
    console.log("TodoContract deployed to:", await todo.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});

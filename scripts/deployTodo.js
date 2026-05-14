const { ethers } = require("hardhat");

async function main() {
    const TodoContract = await ethers.getContractFactory("TodoContract");
    const todo = await TodoContract.deploy();
    await todo.deployed();
    console.log("TodoContract deployed to:", todo.address);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});

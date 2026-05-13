import { ethers } from "hardhat";

async function main() {

    const GetAllTask = await ethers.getContractFactory("GetAllTask");

    const contract = await GetAllTask.deploy();

    await contract.waitForDeployment();

    console.log("Deployed to:", await contract.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
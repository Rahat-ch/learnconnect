import { ethers } from "hardhat";

async function main() {

  const sage = await ethers.deployContract("Sage");

  await sage.waitForDeployment();

  console.log(
    `Sage deployed to ${sage.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

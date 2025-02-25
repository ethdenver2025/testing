import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy FormicaryEscrow
  const FormicaryEscrow = await ethers.getContractFactory("FormicaryEscrow");
  const usdcAddress = process.env.USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
  const escrow = await FormicaryEscrow.deploy(usdcAddress);
  await escrow.deployed();
  console.log("FormicaryEscrow deployed to:", escrow.address);

  // Deploy FormicaryReputation
  const FormicaryReputation = await ethers.getContractFactory("FormicaryReputation");
  const reputation = await FormicaryReputation.deploy();
  await reputation.deployed();
  console.log("FormicaryReputation deployed to:", reputation.address);

  // Deploy FormicaryJob
  const FormicaryJob = await ethers.getContractFactory("FormicaryJob");
  const job = await FormicaryJob.deploy(escrow.address, reputation.address);
  await job.deployed();
  console.log("FormicaryJob deployed to:", job.address);

  // Set up permissions
  await escrow.transferOwnership(job.address);
  console.log("Transferred FormicaryEscrow ownership to FormicaryJob");

  // Verify contracts on Basescan
  if (process.env.BASESCAN_API_KEY) {
    console.log("Verifying contracts on Basescan...");
    
    await run("verify:verify", {
      address: escrow.address,
      constructorArguments: [usdcAddress],
    });

    await run("verify:verify", {
      address: reputation.address,
      constructorArguments: [],
    });

    await run("verify:verify", {
      address: job.address,
      constructorArguments: [escrow.address, reputation.address],
    });
  }

  // Output deployment addresses
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("FormicaryEscrow:", escrow.address);
  console.log("FormicaryReputation:", reputation.address);
  console.log("FormicaryJob:", job.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require("hardhat");

async function main() {
  console.log("Deploying BatchTokenDistributor...");

  const BatchTokenDistributor = await hre.ethers.getContractFactory("BatchTokenDistributor");
  const distributor = await BatchTokenDistributor.deploy();

  await distributor.waitForDeployment();

  const address = await distributor.getAddress();

  console.log("✅ BatchTokenDistributor deployed to:", address);
  console.log("\nNext steps:");
  console.log("1. Add this address to your .env file as DISTRIBUTOR_CONTRACT_ADDRESS");
  console.log("2. Verify the contract (optional): npx hardhat verify --network hyperevm", address);
  console.log("3. Ensure your Safe multisig has approved this contract to spend tokens");

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

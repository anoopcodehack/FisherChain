const hre = require("hardhat");

async function main() {
  console.log("Deploying FisherChain contract...");

  const FisherChain = await hre.ethers.getContractFactory("FisherChain");
  const fisherChain = await FisherChain.deploy();

  await fisherChain.waitForDeployment();

  const address = await fisherChain.getAddress();
  console.log(`✅ FisherChain deployed to: ${address}`);

  // Save this address somewhere accessible for the frontend
  const fs = require("fs");
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    "./deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployment-info.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
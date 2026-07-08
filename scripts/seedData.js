const hre = require("hardhat");

async function main() {
  const [admin, fisherman1, fisherman2, distributor, retailer] = await hre.ethers.getSigners();

  const FisherChain = await hre.ethers.getContractFactory("FisherChain");
  const fisherChain = await FisherChain.deploy();
  await fisherChain.waitForDeployment();

  const address = await fisherChain.getAddress();
  console.log(`FisherChain deployed to: ${address}`);

  // Register additional fishermen
  await fisherChain.registerFisherman(fisherman1.address);
  await fisherChain.registerFisherman(fisherman2.address);
  console.log("Fishermen registered ✅");

  // Seed a few realistic catches
  const catches = [
    {
      species: "Mackerel",
      quantity: 120,
      location: "12.9141,74.8560", // Mangaluru coast
      ipfsHash: "QmDemoHash1",
      price: 450,
      signer: fisherman1,
    },
    {
      species: "Sardine",
      quantity: 200,
      location: "12.8698,74.8420",
      ipfsHash: "QmDemoHash2",
      price: 300,
      signer: fisherman1,
    },
    {
      species: "Kingfish",
      quantity: 80,
      location: "12.9500,74.8300",
      ipfsHash: "QmDemoHash3",
      price: 900,
      signer: fisherman2,
    },
  ];

  for (const item of catches) {
    const tx = await fisherChain
      .connect(item.signer)
      .registerCatch(item.species, item.quantity, item.location, item.ipfsHash, item.price);
    await tx.wait();
    console.log(`Registered catch: ${item.species} by ${item.signer.address}`);
  }

  // Simulate a couple of transfers down the chain for batch #1
  let tx = await fisherChain.connect(fisherman1).transferBatch(1, distributor.address, 600, 1); // Auctioned
  await tx.wait();
  console.log("Batch #1 transferred to distributor ✅");

  tx = await fisherChain.connect(distributor).transferBatch(1, retailer.address, 800, 3); // AtRetailer
  await tx.wait();
  console.log("Batch #1 transferred to retailer ✅");

  console.log("\n🎉 Seed data complete!");
  console.log(`Contract address: ${address}`);
  console.log(`Admin: ${admin.address}`);
  console.log(`Fisherman 1: ${fisherman1.address}`);
  console.log(`Fisherman 2: ${fisherman2.address}`);
  console.log(`Distributor: ${distributor.address}`);
  console.log(`Retailer: ${retailer.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
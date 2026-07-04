const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FisherChain", function () {
  let fisherChain;
  let admin, fisherman, distributor, retailer;

  beforeEach(async function () {
    [admin, fisherman, distributor, retailer] = await ethers.getSigners();

    const FisherChain = await ethers.getContractFactory("FisherChain");
    fisherChain = await FisherChain.deploy();
    await fisherChain.waitForDeployment();
  });

  it("should set the deployer as admin", async function () {
    expect(await fisherChain.admin()).to.equal(admin.address);
  });

  it("should allow admin to register a fisherman", async function () {
    await fisherChain.registerFisherman(fisherman.address);
    expect(await fisherChain.registeredFishermen(fisherman.address)).to.equal(true);
  });

  it("should allow a registered fisherman to register a catch", async function () {
    await fisherChain.registerFisherman(fisherman.address);

    const tx = await fisherChain.connect(fisherman).registerCatch(
      "Mackerel",
      100,
      "12.9141,74.8560",
      "QmTestIpfsHash123",
      500
    );
    await tx.wait();

    const batch = await fisherChain.getBatch(1);
    expect(batch.species).to.equal("Mackerel");
    expect(batch.fisherman).to.equal(fisherman.address);
    expect(batch.currentOwner).to.equal(fisherman.address);
  });

  it("should NOT allow an unregistered address to register a catch", async function () {
    await expect(
      fisherChain.connect(fisherman).registerCatch(
        "Tuna",
        50,
        "12.9,74.8",
        "QmFakeHash",
        300
      )
    ).to.be.revertedWith("Not a registered fisherman");
  });

  it("should allow transferring a batch to the next stage", async function () {
    await fisherChain.registerFisherman(fisherman.address);
    await fisherChain.connect(fisherman).registerCatch(
      "Sardine",
      200,
      "12.91,74.85",
      "QmHash456",
      400
    );

    // Stage.Auctioned = 1
    await fisherChain.connect(fisherman).transferBatch(1, distributor.address, 600, 1);

    const batch = await fisherChain.getBatch(1);
    expect(batch.currentOwner).to.equal(distributor.address);
    expect(batch.currentPrice).to.equal(600);
    expect(batch.currentStage).to.equal(1);
  });

  it("should NOT allow a non-owner to transfer the batch", async function () {
    await fisherChain.registerFisherman(fisherman.address);
    await fisherChain.connect(fisherman).registerCatch(
      "Pomfret",
      75,
      "12.92,74.86",
      "QmHash789",
      450
    );

    await expect(
      fisherChain.connect(distributor).transferBatch(1, retailer.address, 700, 1)
    ).to.be.revertedWith("Only current owner can transfer");
  });

  it("should track batch history correctly", async function () {
    await fisherChain.registerFisherman(fisherman.address);
    await fisherChain.connect(fisherman).registerCatch(
      "Kingfish",
      150,
      "12.93,74.87",
      "QmHash999",
      800
    );

    await fisherChain.connect(fisherman).transferBatch(1, distributor.address, 1000, 1);
    await fisherChain.connect(distributor).transferBatch(1, retailer.address, 1300, 2);

    const history = await fisherChain.getBatchHistory(1);
    expect(history.length).to.equal(2);
    expect(history[0].to).to.equal(distributor.address);
    expect(history[1].to).to.equal(retailer.address);
  });
});
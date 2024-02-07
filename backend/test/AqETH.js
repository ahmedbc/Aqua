const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("AqETH", function () {

  async function deployAqETHFixture() {

    const [owner, addr1] = await ethers.getSigners();

    const AqETH = await ethers.getContractFactory("AqETH");
    const aqETH = await AqETH.deploy();

    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));
    return { aqETH, owner, addr1, MINTER_ROLE, BURNER_ROLE };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { aqETH, owner } = await loadFixture(deployAqETHFixture);

      expect(await aqETH.owner()).to.equal(owner.address);
    });

    it("Should has the correct name", async function () {
      const { aqETH } = await loadFixture(deployAqETHFixture);

      expect(await aqETH.name()).to.equal("Aqua staked ETH");
    });

    it("Should has the correct symbole", async function () {
      const { aqETH } = await loadFixture(deployAqETHFixture);

      expect(await aqETH.symbol()).to.equal("aqETH");
    });

  });

  describe("Minting and Burning", function () {

    it("Should mint tokens only from the stacking contract", async function () {
      const { aqETH, owner, addr1, MINTER_ROLE } = await loadFixture(deployAqETHFixture);

      await expect(aqETH.mint(addr1.address, 1000)).to.be
        .revertedWithCustomError(aqETH, "AccessControlUnauthorizedAccount").withArgs(owner, MINTER_ROLE);
    });

    it("Should burn tokens only from the stacking contract", async function () {
      const { aqETH, owner, addr1, BURNER_ROLE } = await loadFixture(deployAqETHFixture);

      await expect(aqETH.burn(addr1.address, 500)).to.be
        .revertedWithCustomError(aqETH, "AccessControlUnauthorizedAccount").withArgs(owner, BURNER_ROLE);
    });

  });

});

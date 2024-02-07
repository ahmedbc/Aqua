const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
  
  describe("Aqua", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployAquaFixture() {
  
      // Contracts are deployed using the first signer/account by default
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      // first deploying the AqETH token contract 
      const AqETH = await ethers.getContractFactory("AqETH");
      const aqETH = await AqETH.deploy();

      // second deploying the Aqua staking contract 
      const Aqua = await ethers.getContractFactory("Aqua");
      const aqua = await Aqua.deploy(aqETH.target);
      
      // Grant Roles for the Aqua Staking contract
      const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
      await aqETH.grantRole(MINTER_ROLE, aqua.target);
      const BURNER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BURNER_ROLE"));
      await aqETH.grantRole(BURNER_ROLE, aqua.target);

      return { aqua, aqETH, owner, addr1, addr2, MINTER_ROLE, BURNER_ROLE };
    }
  
    describe("Deployment", function () {   

        it("Should set the right owner", async function () {
            const { aqua, owner } = await loadFixture(deployAquaFixture);
            expect(await aqua.owner()).to.equal(owner.address);
        });

        it("should correctly set the AqETH contract address", async function () {
            const { aqua, aqETH } = await deployAquaFixture();
            expect(await aqua.aqETH()).to.equal(aqETH.target);
        });

        it("should initialize total shares and pooled ETH to 0", async function () {
            const { aqua } = await deployAquaFixture();
            expect(await aqua.getTotalPooledEther()).to.equal(0);
            expect(await aqua.getTotalShares()).to.equal(0);
        });

    });

    describe("Staking and Whitedrawing ETH", function () {
        it("allows users to stake ETH and updates total pooled ETH and shares", async function () {
            const { aqua, addr1 } = await loadFixture(deployAquaFixture);
            const amountToStake = ethers.parseEther("10");
    
            // Stake ETH
            await aqua.connect(addr1).stakeETH({ value: amountToStake });
    
            // Check total pooled ETH and user shares
            expect(await aqua.getTotalPooledEther()).to.equal(amountToStake);
            // Assuming a 1:1 staking ratio for simplicity
            expect(await aqua.sharesOf(addr1.address)).to.equal(amountToStake);

            // Withdraw ETH by burning shares
            const amountToWithdraw = ethers.parseEther("5");
            const tx = await aqua.connect(addr1).withdrawETH(amountToWithdraw);
            const receipt = await tx.wait();
            
            const txCost = receipt.gasPrice * receipt.gasUsed;
            const finalBalance = await ethers.provider.getBalance(addr1.address);

            // Check if ETH was correctly withdrawn
            expect(finalBalance + txCost - amountToStake).to.be.above(0);

            // Verify shares and total pooled ETH are updated
            // Adjust the expected values based on your contract's logic
            expect(await aqua.getTotalPooledEther()).to.be.below(amountToStake);
            expect(await aqua.sharesOf(addr1.address)).to.be.below(amountToStake);

        });
    });

    describe("Receiving direct ETH fund", function () { 

        it("should revert direct ETH transfers with DirectETHTransfer error", async function () {
            const { aqua, addr1 } = await deployAquaFixture();

            // Attempt to send ETH directly to the contract's address
            await expect(
              addr1.sendTransaction({
                to: aqua.target,
                value: ethers.parseEther("1.0"), // Sending 1 ETH
              })
            ).to.be.revertedWithCustomError(aqua, "DirectETHTransfer");
        });
    })
 
});
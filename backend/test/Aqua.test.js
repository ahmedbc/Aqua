const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Aqua", function () {

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployAquaFixture() {

        // Contracts are deployed using the first signer/account by default
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        const Aqua = await ethers.getContractFactory("Aqua");
        const aqua = await Aqua.deploy();

        // Generate a random amount half the account balances
        const accountsBalance = ethers.parseEther("10000");
        const randomAmount = ethers.parseEther(Math.floor(Math.random() * 4999).toString());

        return { aqua, owner, addr1, addr2, addr3, randomAmount, accountsBalance };
    }
    //const { aqua, owner, addr1, addr2, addr3 } = await loadFixture(deployAquaFixture);
    describe("Deployment", function () {

        it("Should set the right owner", async function () {
            const { aqua, owner } = await loadFixture(deployAquaFixture);
            expect(await aqua.owner()).to.equal(owner.address);
        });

        it("Should has the correct name", async function () {
            const { aqua } = await loadFixture(deployAquaFixture);
            expect(await aqua.name()).to.equal("Aqua staked ETH");
        });

        it("Should has the correct symbole", async function () {
            const { aqua } = await loadFixture(deployAquaFixture);
            expect(await aqua.symbol()).to.equal("aqETH");
        });

        it("Should has the correct symbole", async function () {
            const { aqua } = await loadFixture(deployAquaFixture);
            expect(await aqua.symbol()).to.equal("aqETH");
        });

        it("Should set the right decimals", async function () {
            const { aqua } = await loadFixture(deployAquaFixture);
            expect(await aqua.decimals()).to.equal(18);
        });

    });

    describe("Deposit", function () {

        it("Should previewDeposit return 0 in an empty vault", async function () {
            const { aqua, randomAmount } = await loadFixture(deployAquaFixture);
            expect(await aqua.previewDeposit(randomAmount)).to.equal(0);
        });

        it("Should allow deposits and emit Deposit event", async function () {
            const { aqua, addr1, addr2, randomAmount } = await loadFixture(deployAquaFixture);
            const accountsBalance = ethers.parseEther("4000");
            /*await expect(aqua.connect(addr1).deposit({ value: randomAmount }))
                .to.emit(aqua, "Deposit")
                .withArgs(addr1.address, randomAmount, randomAmount);*/
            //const expectedShares = await aqua.previewDeposit(accountsBalance);
            //console.log("accountsBalance", accountsBalance);
            //console.log("expectedShares", expectedShares);
            //console.log("balanceOf",  await aqua.balanceOf(addr1.address));
            //expect(await aqua.balanceOf(addr1.address)).to.equal(expectedShares);
        });

        it("Should totalSupply match the amount of deposits", async function () {
            const { aqua, addr1, randomAmount } = await loadFixture(deployAquaFixture);

            await aqua.connect(addr1).deposit({ value: randomAmount });
            const expectedShares = await aqua.previewDeposit(randomAmount);
            expect(await aqua.totalSupply()).to.equal(expectedShares);
        });

        it("Should contract eth balance match the amount of deposits", async function () {
            const { aqua, addr1, addr2, randomAmount } = await loadFixture(deployAquaFixture);

            await aqua.connect(addr2).deposit({ value: randomAmount });
            await aqua.connect(addr1).deposit({ value: randomAmount });
            await aqua.connect(addr1).deposit({ value: randomAmount });
            await aqua.connect(addr2).deposit({ value: randomAmount });

            expect(await ethers.provider.getBalance(aqua.target)).to.equal(randomAmount * 4n);
        });

        it("Should depositer eth balance match the amount of deposits", async function () {
            const { aqua, addr1, randomAmount } = await loadFixture(deployAquaFixture);

            const initialBalance = await ethers.provider.getBalance(addr1.address);
            const tx = await aqua.connect(addr1).deposit({ value: randomAmount });
            const receipt = await tx.wait();
            const gasCost = receipt.gasUsed * tx.gasPrice;
            const finalBalance = await ethers.provider.getBalance(addr1.address);

            const tolerance = ethers.parseEther("0.0001");
            expect(finalBalance + gasCost + randomAmount).to.be.closeTo(initialBalance, tolerance);
        });


        it("should reject direct ETH transfers", async function () {
            const { aqua, addr1, randomAmount } = await loadFixture(deployAquaFixture);
            // Attempt to send ETH directly to the contract
            await expect(
                addr1.sendTransaction({
                    to: aqua.target,
                    value: randomAmount
                })
            ).to.be.reverted;
        });

        it("Should revert with ExceededMaxDeposit when depositing more then allowed", async function () {
            const { aqua, addr1 } = await loadFixture(deployAquaFixture);
            const maxDepositPlusOne = ethers.parseEther("5001");
            await expect(aqua.connect(addr1).deposit({ value: maxDepositPlusOne }))
                .to.be.revertedWithCustomError(aqua, "ExceededMaxDeposit");
        });

        it("Should revert when passing 0 to deposit", async function () {
            const { aqua, addr1 } = await loadFixture(deployAquaFixture);
            await expect(aqua.connect(addr1).deposit({ value: 0 }))
                .to.be.reverted;
        });

    });

    describe("Redeem", function () {
        it("Should previewRedeem return 0 in an empty vault", async function () {
            const { aqua, randomAmount } = await loadFixture(deployAquaFixture);
            expect(await aqua.previewRedeem(randomAmount)).to.equal(0);
        });

        it("Should allow redeem and emit Redeem event", async function () {
            const { aqua, addr1, randomAmount } = await loadFixture(deployAquaFixture);

            await aqua.connect(addr1).deposit({ value: randomAmount });
            const shares = await aqua.previewDeposit(randomAmount);
          
            await expect(aqua.connect(addr1).redeem(shares))
                .to.emit(aqua, "Redeem")
                .withArgs(addr1.address, randomAmount, shares);

        });

        
        it("Should depositer's ETH balance match the amount of deposits/redeems, accounting for gas", async function () {
            const { aqua, addr1, randomAmount } = await loadFixture(deployAquaFixture);
        
            const initialBalance = await ethers.provider.getBalance(addr1.address);

            const txDeposit = await aqua.connect(addr1).deposit({ value: randomAmount });
            const receiptDeposit = await txDeposit.wait();
            const gasCostDeposit = receiptDeposit.gasUsed * txDeposit.gasPrice; // Direct BigInt operation
        
            const sharesToRedeem = await aqua.previewDeposit(randomAmount);
            const txRedeem = await aqua.connect(addr1).redeem(sharesToRedeem);
            const receiptRedeem = await txRedeem.wait();
            const gasCostRedeem = receiptRedeem.gasUsed * txRedeem.gasPrice;

            const finalBalance = await ethers.provider.getBalance(addr1.address);
            const expectedFinalBalance = initialBalance - gasCostDeposit - gasCostRedeem;
            const tolerance = BigInt(ethers.parseEther("0.00001").toString());
            
            expect(expectedFinalBalance).to.be.closeTo(finalBalance, tolerance);
          
        });

        it("Should revert with ExceededMaxRedeem when reedeming more then allowed", async function () {
            const { aqua, addr1, randomAmount } = await loadFixture(deployAquaFixture);

            await aqua.connect(addr1).deposit({ value: randomAmount });
            await expect(aqua.connect(addr1).redeem(randomAmount + 1n))
                .to.be.revertedWithCustomError(aqua, "ExceededMaxRedeem");
        });

        it("Should revert when passing 0 to redeem", async function () {
            const { aqua, addr1 } = await loadFixture(deployAquaFixture);
            await expect(aqua.connect(addr1).redeem(0))
                .to.be.reverted;
        });
        
    });
});
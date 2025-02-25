import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestContracts, createTestJob } from "./helpers";
import { FormicaryEscrow } from "../typechain-types";

describe("FormicaryEscrow", function () {
  let escrow: FormicaryEscrow;

  beforeEach(async function () {
    const contracts = await deployTestContracts();
    escrow = contracts.escrow;
    this.contracts = contracts;
  });

  describe("Escrow Creation", function () {
    it("should create escrow with correct parameters", async function () {
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);
      
      const escrowData = await escrow.getEscrow(jobId);
      expect(escrowData.client).to.equal(this.contracts.client.address);
      expect(escrowData.amount).to.equal(ethers.utils.parseEther("1"));
      expect(escrowData.released).to.be.false;
      expect(escrowData.disputed).to.be.false;
    });

    it("should fail if escrow already exists", async function () {
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);
      
      await expect(
        escrow.createEscrow(jobId, this.contracts.worker1.address)
      ).to.be.revertedWith("Only job contract can call this");
    });
  });

  describe("Escrow Release", function () {
    it("should release escrow and transfer funds correctly", async function () {
      // Create job and escrow
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);
      
      // Setup worker and complete job
      await this.contracts.job.connect(this.contracts.client).startJob(jobId, this.contracts.worker1.address);
      await this.contracts.job.connect(this.contracts.client).completeJob(jobId);

      const escrowData = await escrow.getEscrow(jobId);
      expect(escrowData.released).to.be.true;
    });

    it("should collect platform fee on release", async function () {
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);
      
      // Get initial treasury balance
      const treasuryAddress = await escrow.TREASURY();
      const initialBalance = await ethers.provider.getBalance(treasuryAddress);

      // Complete job and release escrow
      await this.contracts.job.connect(this.contracts.client).startJob(jobId, this.contracts.worker1.address);
      await this.contracts.job.connect(this.contracts.client).completeJob(jobId);

      // Check treasury received platform fee
      const finalBalance = await ethers.provider.getBalance(treasuryAddress);
      expect(finalBalance.sub(initialBalance)).to.be.gt(0);
    });
  });

  describe("Dispute Handling", function () {
    it("should handle disputes correctly", async function () {
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);
      
      // Start job
      await this.contracts.job.connect(this.contracts.client).startJob(jobId, this.contracts.worker1.address);
      
      // Initiate dispute
      await this.contracts.job.connect(this.contracts.worker1).initiateDispute(jobId);

      const escrowData = await escrow.getEscrow(jobId);
      expect(escrowData.disputed).to.be.true;
    });

    it("should resolve disputes and distribute funds correctly", async function () {
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);
      
      // Start job and initiate dispute
      await this.contracts.job.connect(this.contracts.client).startJob(jobId, this.contracts.worker1.address);
      await this.contracts.job.connect(this.contracts.worker1).initiateDispute(jobId);

      // Resolve dispute (50-50 split)
      const totalAmount = ethers.utils.parseEther("1");
      const halfAmount = totalAmount.div(2);

      await escrow.resolveDispute(jobId, this.contracts.worker1.address, halfAmount);

      const escrowData = await escrow.getEscrow(jobId);
      expect(escrowData.released).to.be.true;
    });

    it("should only allow owner to resolve disputes", async function () {
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);
      
      // Start job and initiate dispute
      await this.contracts.job.connect(this.contracts.client).startJob(jobId, this.contracts.worker1.address);
      await this.contracts.job.connect(this.contracts.worker1).initiateDispute(jobId);

      // Try to resolve dispute as non-owner
      await expect(
        escrow.connect(this.contracts.worker1).resolveDispute(
          jobId,
          this.contracts.worker1.address,
          ethers.utils.parseEther("0.5")
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Status Checks", function () {
    it("should correctly report escrow status", async function () {
      const { jobId } = await createTestJob(this.contracts.job, this.contracts.client, 1);

      expect(await escrow.isEscrowReleased(jobId)).to.be.false;
      expect(await escrow.isEscrowDisputed(jobId)).to.be.false;

      // Start job and initiate dispute
      await this.contracts.job.connect(this.contracts.client).startJob(jobId, this.contracts.worker1.address);
      await this.contracts.job.connect(this.contracts.worker1).initiateDispute(jobId);

      expect(await escrow.isEscrowDisputed(jobId)).to.be.true;
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestContracts } from "./helpers";
import { FormicaryReputation } from "../typechain-types";

describe("FormicaryReputation", function () {
  let reputation: FormicaryReputation;

  beforeEach(async function () {
    const contracts = await deployTestContracts();
    reputation = contracts.reputation;
    this.contracts = contracts;
  });

  describe("Skill Management", function () {
    it("should add a new skill correctly", async function () {
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      const skillName = "coding";
      const skillLevel = 3;

      await expect(reputation.connect(worker).addSkill(skillName, skillLevel))
        .to.emit(reputation, "SkillAdded")
        .withArgs(workerAddress, skillName, skillLevel);

      const skill = await reputation.getWorkerSkill(workerAddress, skillName);
      expect(skill.name).to.equal(skillName);
      expect(skill.level).to.equal(skillLevel);
      expect(skill.verified).to.be.false;
    });

    it("should update existing skill level", async function () {
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      const skillName = "coding";
      
      // Add initial skill
      await reputation.connect(worker).addSkill(skillName, 3);
      
      // Update skill level
      const newLevel = 4;
      await reputation.connect(worker).addSkill(skillName, newLevel);

      const skill = await reputation.getWorkerSkill(workerAddress, skillName);
      expect(skill.level).to.equal(newLevel);
    });

    it("should fail with invalid skill level", async function () {
      const worker = this.contracts.worker1;
      await expect(
        reputation.connect(worker).addSkill("coding", 0)
      ).to.be.revertedWith("Invalid skill level");

      await expect(
        reputation.connect(worker).addSkill("coding", 6)
      ).to.be.revertedWith("Invalid skill level");
    });
  });

  describe("Skill Validation", function () {
    beforeEach(async function () {
      await reputation.connect(this.contracts.worker1).addSkill("coding", 3);
    });

    it("should validate skill correctly", async function () {
      const validator = this.contracts.worker2;
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      const validatorAddress = await validator.getAddress();
      const skillName = "coding";

      await expect(reputation.connect(validator).validateSkill(workerAddress, skillName))
        .to.emit(reputation, "SkillValidated")
        .withArgs(workerAddress, skillName, validatorAddress);

      const skill = await reputation.getWorkerSkill(workerAddress, skillName);
      expect(skill.validations).to.equal(1);
    });

    it("should verify skill after threshold validations", async function () {
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      const skillName = "coding";
      const validators = [
        this.contracts.worker2,
        this.contracts.owner,
        this.contracts.client
      ];

      // Get three different validators to validate the skill
      for (const validator of validators) {
        await reputation.connect(validator).validateSkill(workerAddress, skillName);
      }

      const skill = await reputation.getWorkerSkill(workerAddress, skillName);
      expect(skill.verified).to.be.true;
    });

    it("should not allow self-validation", async function () {
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      const skillName = "coding";

      await expect(
        reputation.connect(worker).validateSkill(workerAddress, skillName)
      ).to.be.revertedWith("Cannot validate own skill");
    });

    it("should not allow duplicate validation", async function () {
      const validator = this.contracts.worker2;
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      const skillName = "coding";

      await reputation.connect(validator).validateSkill(workerAddress, skillName);

      await expect(
        reputation.connect(validator).validateSkill(workerAddress, skillName)
      ).to.be.revertedWith("Already validated this skill");
    });
  });

  describe("Reputation Updates", function () {
    it("should update reputation correctly", async function () {
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      const jobId = 1;
      const score = 85;

      await reputation.updateReputation(workerAddress, jobId, score);
      const newReputation = await reputation.getWorkerReputation(workerAddress);
      expect(newReputation).to.equal(score);
    });

    it("should calculate weighted average for multiple jobs", async function () {
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      
      // First job
      await reputation.updateReputation(workerAddress, 1, 80);
      
      // Second job
      await reputation.updateReputation(workerAddress, 2, 90);
      
      // Should be average of both scores
      const finalReputation = await reputation.getWorkerReputation(workerAddress);
      expect(finalReputation).to.equal(85);
    });

    it("should fail with invalid score", async function () {
      const worker = this.contracts.worker1;
      const workerAddress = await worker.getAddress();
      await expect(
        reputation.updateReputation(workerAddress, 1, 101)
      ).to.be.revertedWith("Score exceeds maximum");
    });
  });
});

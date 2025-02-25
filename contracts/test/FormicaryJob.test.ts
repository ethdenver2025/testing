import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestContracts, createTestJob, setupWorkerWithSkills } from "./helpers";
import { FormicaryJob } from "../typechain-types";

describe("FormicaryJob", function () {
  let job: FormicaryJob;

  beforeEach(async function () {
    const contracts = await deployTestContracts();
    job = contracts.job;
    this.contracts = contracts;
  });

  describe("Job Creation", function () {
    it("should create a job with correct parameters", async function () {
      const { jobId, jobData } = await createTestJob(job, this.contracts.client, 1);
      
      const createdJob = await job.getJob(jobId);
      expect(createdJob.title).to.equal(jobData.title);
      expect(createdJob.description).to.equal(jobData.description);
      expect(createdJob.budget).to.equal(jobData.budget);
      expect(createdJob.deadline).to.equal(jobData.deadline);
      expect(createdJob.client).to.equal(await this.contracts.client.getAddress());
      expect(createdJob.status).to.equal(0); // Open status
    });

    it("should fail if budget is not provided", async function () {
      const jobData = {
        title: "Test Job",
        description: "Test Description",
        budget: ethers.parseEther("1"),
        deadline: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
        requiredSkills: ["coding"],
        skillLevels: [3]
      };

      await expect(
        job.connect(this.contracts.client).createJob(
          jobData.title,
          jobData.description,
          jobData.budget,
          jobData.deadline,
          jobData.requiredSkills,
          jobData.skillLevels,
          { value: 0n }
        )
      ).to.be.revertedWith("Insufficient funds for budget");
    });
  });

  describe("Job Application", function () {
    it("should allow qualified worker to apply", async function () {
      // Create a job
      const { jobId } = await createTestJob(job, this.contracts.client, 1);

      // Setup worker skills
      await setupWorkerWithSkills(
        this.contracts.reputation,
        this.contracts.worker1,
        [this.contracts.worker2, this.contracts.owner]
      );

      // Apply for job
      const workerAddress = await this.contracts.worker1.getAddress();
      await expect(job.connect(this.contracts.worker1).applyForJob(jobId))
        .to.emit(job, "JobApplied")
        .withArgs(jobId, workerAddress);
    });

    it("should reject unqualified worker", async function () {
      const { jobId } = await createTestJob(job, this.contracts.client, 1);

      await expect(
        job.connect(this.contracts.worker1).applyForJob(jobId)
      ).to.be.revertedWith("Worker does not meet skill requirements");
    });
  });

  describe("Job Lifecycle", function () {
    it("should complete full job lifecycle successfully", async function () {
      // Create job
      const { jobId } = await createTestJob(job, this.contracts.client, 1);

      // Setup worker
      await setupWorkerWithSkills(
        this.contracts.reputation,
        this.contracts.worker1,
        [this.contracts.worker2, this.contracts.owner]
      );

      // Worker applies
      await job.connect(this.contracts.worker1).applyForJob(jobId);

      // Client starts job
      const workerAddress = await this.contracts.worker1.getAddress();
      await expect(job.connect(this.contracts.client).startJob(jobId, workerAddress))
        .to.emit(job, "JobStarted")
        .withArgs(jobId, workerAddress);

      // Client completes job
      await expect(job.connect(this.contracts.client).completeJob(jobId))
        .to.emit(job, "JobCompleted")
        .withArgs(jobId);

      const completedJob = await job.getJob(jobId);
      expect(completedJob.status).to.equal(2); // Completed status
    });

    it("should handle disputes correctly", async function () {
      const { jobId } = await createTestJob(job, this.contracts.client, 1);

      // Setup and apply worker
      await setupWorkerWithSkills(
        this.contracts.reputation,
        this.contracts.worker1,
        [this.contracts.worker2, this.contracts.owner]
      );
      await job.connect(this.contracts.worker1).applyForJob(jobId);

      // Start job
      const workerAddress = await this.contracts.worker1.getAddress();
      await job.connect(this.contracts.client).startJob(jobId, workerAddress);

      // Initiate dispute
      await expect(job.connect(this.contracts.worker1).initiateDispute(jobId))
        .to.emit(job, "JobDisputed")
        .withArgs(jobId, workerAddress);

      const disputedJob = await job.getJob(jobId);
      expect(disputedJob.status).to.equal(4); // Disputed status
    });
  });
});

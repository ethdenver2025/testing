import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { 
  FormicaryJob,
  FormicaryEscrow,
  FormicaryReputation,
  MockUSDC
} from "../typechain-types";

export async function deployTestContracts() {
  const [owner, client, worker1, worker2] = await ethers.getSigners();

  // Deploy mock USDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();

  // Deploy Escrow
  const FormicaryEscrow = await ethers.getContractFactory("FormicaryEscrow");
  const escrow = await FormicaryEscrow.deploy(await mockUSDC.getAddress());

  // Deploy Reputation
  const FormicaryReputation = await ethers.getContractFactory("FormicaryReputation");
  const reputation = await FormicaryReputation.deploy();

  // Deploy Job
  const FormicaryJob = await ethers.getContractFactory("FormicaryJob");
  const job = await FormicaryJob.deploy(await escrow.getAddress(), await reputation.getAddress());

  // Transfer ownership of Escrow to Job contract
  await escrow.transferOwnership(await job.getAddress());

  return {
    mockUSDC,
    escrow,
    reputation,
    job,
    owner,
    client,
    worker1,
    worker2
  };
}

export async function createTestJob(
  job: FormicaryJob,
  client: any,
  budget: number
) {
  const jobData = {
    title: "Test Job",
    description: "Test job description",
    budget: ethers.parseEther(budget.toString()),
    deadline: (await time.latest()) + time.duration.days(7),
    requiredSkills: ["coding", "testing"],
    skillLevels: [3, 2]
  };

  const tx = await job.connect(client).createJob(
    jobData.title,
    jobData.description,
    jobData.budget,
    jobData.deadline,
    jobData.requiredSkills,
    jobData.skillLevels,
    { value: jobData.budget }
  );

  const receipt = await tx.wait();
  const event = receipt?.logs.find((log: any) => 
    log.fragment?.name === "JobCreated"
  );
  const jobId = event?.args?.jobId;

  return { jobId, jobData };
}

export async function setupWorkerWithSkills(
  reputation: FormicaryReputation,
  worker: any,
  validators: any[]
) {
  const skills = ["coding", "testing"];
  const levels = [3, 2];

  for (let i = 0; i < skills.length; i++) {
    await reputation.connect(worker).addSkill(skills[i], levels[i]);
    
    // Get validators to validate the skill
    for (const validator of validators) {
      await reputation.connect(validator).validateSkill(await worker.getAddress(), skills[i]);
    }
  }

  return { skills, levels };
}

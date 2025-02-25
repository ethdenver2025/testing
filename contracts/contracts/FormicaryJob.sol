// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IFormicaryJob.sol";
import "./FormicaryEscrow.sol";
import "./FormicaryReputation.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FormicaryJob is IFormicaryJob, ReentrancyGuard, Ownable {
    FormicaryEscrow public escrow;
    FormicaryReputation public reputation;
    
    uint256 private jobCounter;
    mapping(uint256 => Job) private jobs;
    mapping(uint256 => address[]) private jobApplicants;
    mapping(uint256 => mapping(address => bool)) private hasApplied;
    
    constructor(
        address _escrow,
        address _reputation
    ) {
        escrow = FormicaryEscrow(_escrow);
        reputation = FormicaryReputation(_reputation);
        jobCounter = 0;
    }
    
    function createJob(
        string memory title,
        string memory description,
        uint256 budget,
        uint256 deadline,
        string[] memory requiredSkills,
        uint256[] memory skillLevels
    ) external payable override nonReentrant returns (uint256) {
        require(msg.value >= budget, "Insufficient funds for budget");
        require(deadline > block.timestamp, "Invalid deadline");
        require(requiredSkills.length == skillLevels.length, "Skills/levels mismatch");
        
        uint256 jobId = ++jobCounter;
        jobs[jobId] = Job({
            jobId: jobId,
            title: title,
            description: description,
            budget: budget,
            deadline: deadline,
            client: msg.sender,
            worker: address(0),
            status: JobStatus.Open,
            requiredSkills: requiredSkills,
            skillLevels: skillLevels
        });
        
        // Create escrow
        escrow.createEscrow{value: msg.value}(jobId, address(0));
        
        emit JobCreated(jobId, msg.sender, budget);
        return jobId;
    }
    
    function applyForJob(uint256 jobId) external override nonReentrant {
        require(jobs[jobId].status == JobStatus.Open, "Job not open");
        require(!hasApplied[jobId][msg.sender], "Already applied");
        
        // Check if worker meets skill requirements
        string[] memory requiredSkills = jobs[jobId].requiredSkills;
        uint256[] memory skillLevels = jobs[jobId].skillLevels;
        
        for (uint256 i = 0; i < requiredSkills.length; i++) {
            (bool hasSkill, uint256 level, bool verified) = reputation.getWorkerSkillDetails(
                msg.sender,
                requiredSkills[i]
            );
            require(hasSkill && level >= skillLevels[i] && verified, "Worker does not meet skill requirements");
        }
        
        jobApplicants[jobId].push(msg.sender);
        hasApplied[jobId][msg.sender] = true;
        
        emit JobApplied(jobId, msg.sender);
    }
    
    function startJob(uint256 jobId, address worker) external override nonReentrant {
        require(jobs[jobId].client == msg.sender, "Not the client");
        require(jobs[jobId].status == JobStatus.Open, "Job not open");
        require(hasApplied[jobId][worker], "Worker has not applied");
        
        jobs[jobId].worker = worker;
        jobs[jobId].status = JobStatus.InProgress;
        
        emit JobStarted(jobId, worker);
    }
    
    function completeJob(uint256 jobId) external override nonReentrant {
        Job storage job = jobs[jobId];
        require(msg.sender == job.client, "Not the client");
        require(job.status == JobStatus.InProgress, "Job not in progress");
        
        job.status = JobStatus.Completed;
        
        // Release escrow to worker
        escrow.releaseEscrow(jobId);
        
        // Update worker reputation
        reputation.updateReputation(job.worker, jobId, 100); // Max score for completion
        
        emit JobCompleted(jobId);
    }
    
    function initiateDispute(uint256 jobId) external override nonReentrant {
        Job storage job = jobs[jobId];
        require(msg.sender == job.client || msg.sender == job.worker, "Not authorized");
        require(job.status == JobStatus.InProgress, "Cannot dispute");
        
        job.status = JobStatus.Disputed;
        escrow.disputeEscrow(jobId);
        
        emit JobDisputed(jobId, msg.sender);
    }
    
    function resolveDispute(
        uint256 jobId,
        address payoutAddress,
        uint256 amount
    ) external override onlyOwner nonReentrant {
        require(jobs[jobId].status == JobStatus.Disputed, "Job not disputed");
        
        jobs[jobId].status = JobStatus.Resolved;
        escrow.resolveDispute(jobId, payoutAddress, amount);
        
        emit JobResolved(jobId, payoutAddress, amount);
    }
    
    function getJob(uint256 jobId) external view override returns (Job memory) {
        return jobs[jobId];
    }
    
    function getJobApplicants(uint256 jobId) external view override returns (address[] memory) {
        return jobApplicants[jobId];
    }
}

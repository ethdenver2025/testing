// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IFormicaryJob.sol";
import "./interfaces/IFormicaryEscrow.sol";
import "./interfaces/IFormicaryReputation.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FormicaryJob is IFormicaryJob, ReentrancyGuard, Ownable {
    uint256 private _jobCounter;
    mapping(uint256 => Job) private _jobs;
    mapping(uint256 => address[]) private _jobApplicants;
    mapping(uint256 => address) private _jobWorkers;
    
    IFormicaryEscrow private _escrow;
    IFormicaryReputation private _reputation;

    modifier jobExists(uint256 jobId) {
        require(_jobs[jobId].client != address(0), "Job does not exist");
        _;
    }

    modifier onlyClient(uint256 jobId) {
        require(_jobs[jobId].client == msg.sender, "Only client can perform this action");
        _;
    }

    modifier onlyWorker(uint256 jobId) {
        require(_jobWorkers[jobId] == msg.sender, "Only assigned worker can perform this action");
        _;
    }

    constructor(address escrowAddress, address reputationAddress) {
        _escrow = IFormicaryEscrow(escrowAddress);
        _reputation = IFormicaryReputation(reputationAddress);
    }

    function createJob(
        string memory title,
        string memory description,
        uint256 budget,
        uint256 deadline,
        string[] memory requiredSkills,
        uint256[] memory skillLevels
    ) external payable override nonReentrant returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(requiredSkills.length == skillLevels.length, "Skills and levels length mismatch");
        require(msg.value >= budget, "Insufficient funds for budget");

        uint256 jobId = ++_jobCounter;
        
        _jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            title: title,
            description: description,
            budget: budget,
            deadline: deadline,
            status: JobStatus.Open,
            requiredSkills: requiredSkills,
            skillLevels: skillLevels
        });

        // Create escrow with the budget
        _escrow.createEscrow{value: msg.value}(jobId, address(0));

        emit JobCreated(jobId, msg.sender, budget);
        return jobId;
    }

    function applyForJob(uint256 jobId) external override jobExists(jobId) {
        require(_jobs[jobId].status == JobStatus.Open, "Job is not open for applications");
        require(!_hasApplied(jobId, msg.sender), "Already applied for this job");

        // Verify worker has required skills
        _verifyWorkerSkills(jobId, msg.sender);

        _jobApplicants[jobId].push(msg.sender);
        emit JobApplied(jobId, msg.sender);
    }

    function startJob(uint256 jobId, address worker) external override 
        jobExists(jobId) 
        onlyClient(jobId) 
    {
        require(_jobs[jobId].status == JobStatus.Open, "Job is not open");
        require(_hasApplied(jobId, worker), "Worker has not applied for this job");

        _jobs[jobId].status = JobStatus.InProgress;
        _jobWorkers[jobId] = worker;

        emit JobStarted(jobId, worker);
    }

    function completeJob(uint256 jobId) external override 
        jobExists(jobId) 
        onlyClient(jobId) 
    {
        require(_jobs[jobId].status == JobStatus.InProgress, "Job is not in progress");

        _jobs[jobId].status = JobStatus.Completed;
        address worker = _jobWorkers[jobId];

        // Release escrow to worker
        _escrow.releaseEscrow(jobId);

        // Update worker's reputation
        _reputation.updateReputation(worker, jobId, 100); // Base score for completion

        emit JobCompleted(jobId);
    }

    function cancelJob(uint256 jobId) external override 
        jobExists(jobId) 
        onlyClient(jobId) 
    {
        require(_jobs[jobId].status == JobStatus.Open, "Can only cancel open jobs");

        _jobs[jobId].status = JobStatus.Cancelled;
        emit JobCancelled(jobId);
    }

    function initiateDispute(uint256 jobId) external override jobExists(jobId) {
        require(
            msg.sender == _jobs[jobId].client || msg.sender == _jobWorkers[jobId],
            "Only client or worker can initiate dispute"
        );
        require(_jobs[jobId].status == JobStatus.InProgress, "Job is not in progress");

        _jobs[jobId].status = JobStatus.Disputed;
        _escrow.disputeEscrow(jobId);

        emit JobDisputed(jobId, msg.sender);
    }

    function getJob(uint256 jobId) external view override returns (Job memory) {
        require(_jobs[jobId].client != address(0), "Job does not exist");
        return _jobs[jobId];
    }

    function _hasApplied(uint256 jobId, address worker) internal view returns (bool) {
        address[] memory applicants = _jobApplicants[jobId];
        for (uint i = 0; i < applicants.length; i++) {
            if (applicants[i] == worker) return true;
        }
        return false;
    }

    function _verifyWorkerSkills(uint256 jobId, address worker) internal view {
        Job memory job = _jobs[jobId];
        for (uint i = 0; i < job.requiredSkills.length; i++) {
            require(
                _reputation.isSkillVerified(worker, job.requiredSkills[i]) &&
                _reputation.getWorkerSkill(worker, job.requiredSkills[i]).level >= job.skillLevels[i],
                "Worker does not meet skill requirements"
            );
        }
    }
}

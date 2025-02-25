// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FormicaryCore is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    
    IERC20 public usdcToken;
    
    enum SkillTier { A3, A2, A1 }
    enum JobStatus { Open, InProgress, Completed, Disputed }
    
    struct Worker {
        address workerAddress;
        SkillTier skillTier;
        uint256 reputationScore;
        uint256 totalJobsCompleted;
        uint256 totalEarnings;
        bool isActive;
    }
    
    struct Job {
        uint256 jobId;
        address client;
        SkillTier requiredTier;
        uint256 payment;
        JobStatus status;
        address assignedWorker;
        string ipfsHash; // Job details stored on IPFS
    }
    
    mapping(address => Worker) public workers;
    mapping(uint256 => Job) public jobs;
    uint256 public nextJobId;
    
    event WorkerRegistered(address indexed worker, SkillTier tier);
    event JobCreated(uint256 indexed jobId, address indexed client, uint256 payment);
    event JobAssigned(uint256 indexed jobId, address indexed worker);
    event JobCompleted(uint256 indexed jobId, address indexed worker, uint256 payment);
    event DisputeRaised(uint256 indexed jobId, address indexed initiator);
    
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }
    
    function registerWorker(address _worker, SkillTier _tier) external onlyRole(ADMIN_ROLE) {
        require(!workers[_worker].isActive, "Worker already registered");
        
        workers[_worker] = Worker({
            workerAddress: _worker,
            skillTier: _tier,
            reputationScore: 0,
            totalJobsCompleted: 0,
            totalEarnings: 0,
            isActive: true
        });
        
        emit WorkerRegistered(_worker, _tier);
    }
    
    function createJob(SkillTier _requiredTier, uint256 _payment, string calldata _ipfsHash) 
        external 
        nonReentrant 
        returns (uint256)
    {
        require(_payment > 0, "Payment must be greater than 0");
        
        // Transfer USDC from client to contract
        require(usdcToken.transferFrom(msg.sender, address(this), _payment), "USDC transfer failed");
        
        uint256 jobId = nextJobId++;
        jobs[jobId] = Job({
            jobId: jobId,
            client: msg.sender,
            requiredTier: _requiredTier,
            payment: _payment,
            status: JobStatus.Open,
            assignedWorker: address(0),
            ipfsHash: _ipfsHash
        });
        
        emit JobCreated(jobId, msg.sender, _payment);
        return jobId;
    }
    
    function assignJob(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        Worker storage worker = workers[msg.sender];
        
        require(job.status == JobStatus.Open, "Job not available");
        require(worker.isActive, "Worker not active");
        require(uint256(worker.skillTier) >= uint256(job.requiredTier), "Insufficient skill tier");
        
        job.status = JobStatus.InProgress;
        job.assignedWorker = msg.sender;
        
        emit JobAssigned(_jobId, msg.sender);
    }
    
    function completeJob(uint256 _jobId) external nonReentrant {
        Job storage job = jobs[_jobId];
        Worker storage worker = workers[msg.sender];
        
        require(job.status == JobStatus.InProgress, "Job not in progress");
        require(job.assignedWorker == msg.sender, "Not assigned worker");
        
        job.status = JobStatus.Completed;
        worker.totalJobsCompleted++;
        worker.totalEarnings += job.payment;
        
        // Transfer payment to worker
        require(usdcToken.transfer(msg.sender, job.payment), "Payment transfer failed");
        
        emit JobCompleted(_jobId, msg.sender, job.payment);
    }
    
    function raiseDispute(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client || msg.sender == job.assignedWorker, "Not authorized");
        require(job.status == JobStatus.InProgress, "Invalid job status");
        
        job.status = JobStatus.Disputed;
        emit DisputeRaised(_jobId, msg.sender);
    }
    
    // Additional functions for reputation management, skill tier progression, etc.
    // would be implemented here
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFormicaryJob {
    struct Job {
        uint256 id;
        address client;
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        JobStatus status;
        string[] requiredSkills;
        uint256[] skillLevels;
    }

    enum JobStatus {
        Open,
        InProgress,
        Completed,
        Cancelled,
        Disputed
    }

    event JobCreated(uint256 indexed jobId, address indexed client, uint256 budget);
    event JobApplied(uint256 indexed jobId, address indexed worker);
    event JobStarted(uint256 indexed jobId, address indexed worker);
    event JobCompleted(uint256 indexed jobId);
    event JobCancelled(uint256 indexed jobId);
    event JobDisputed(uint256 indexed jobId, address indexed disputeInitiator);

    function createJob(
        string memory title,
        string memory description,
        uint256 budget,
        uint256 deadline,
        string[] memory requiredSkills,
        uint256[] memory skillLevels
    ) external payable returns (uint256);

    function applyForJob(uint256 jobId) external;
    function startJob(uint256 jobId, address worker) external;
    function completeJob(uint256 jobId) external;
    function cancelJob(uint256 jobId) external;
    function initiateDispute(uint256 jobId) external;
    function getJob(uint256 jobId) external view returns (Job memory);
}

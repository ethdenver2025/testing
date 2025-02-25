// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFormicaryEscrow {
    struct Escrow {
        uint256 jobId;
        address client;
        address worker;
        uint256 amount;
        uint256 releaseTime;
        bool released;
        bool disputed;
    }

    event EscrowCreated(uint256 indexed jobId, address indexed client, address indexed worker, uint256 amount);
    event EscrowReleased(uint256 indexed jobId, address indexed worker, uint256 amount);
    event EscrowDisputed(uint256 indexed jobId, address indexed disputeInitiator);
    event EscrowResolved(uint256 indexed jobId, address indexed recipient, uint256 amount);

    function createEscrow(uint256 jobId, address worker) external payable returns (uint256);
    function releaseEscrow(uint256 jobId) external;
    function disputeEscrow(uint256 jobId) external;
    function resolveDispute(uint256 jobId, address recipient, uint256 amount) external;
    function getEscrow(uint256 jobId) external view returns (Escrow memory);
    function isEscrowReleased(uint256 jobId) external view returns (bool);
    function isEscrowDisputed(uint256 jobId) external view returns (bool);
}

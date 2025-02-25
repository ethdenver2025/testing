// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IFormicaryEscrow.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FormicaryEscrow is IFormicaryEscrow, ReentrancyGuard, Ownable {
    mapping(uint256 => Escrow) private _escrows;
    IERC20 public immutable usdc;
    
    uint256 private constant PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee
    address private constant TREASURY = address(0x123); // Replace with actual treasury address

    event PlatformFeeCollected(uint256 indexed jobId, uint256 amount);

    constructor(address usdcAddress) {
        usdc = IERC20(usdcAddress);
    }

    modifier onlyJobContract() {
        require(msg.sender == owner(), "Only job contract can call this");
        _;
    }

    modifier escrowExists(uint256 jobId) {
        require(_escrows[jobId].client != address(0), "Escrow does not exist");
        _;
    }

    function createEscrow(
        uint256 jobId,
        address worker
    ) external payable override onlyJobContract returns (uint256) {
        require(msg.value > 0, "Escrow amount must be greater than 0");
        require(_escrows[jobId].client == address(0), "Escrow already exists");

        _escrows[jobId] = Escrow({
            jobId: jobId,
            client: tx.origin,
            worker: worker,
            amount: msg.value,
            releaseTime: block.timestamp + 7 days, // Default 7-day escrow period
            released: false,
            disputed: false
        });

        emit EscrowCreated(jobId, tx.origin, worker, msg.value);
        return jobId;
    }

    function releaseEscrow(
        uint256 jobId
    ) external override onlyJobContract escrowExists(jobId) nonReentrant {
        Escrow storage escrow = _escrows[jobId];
        require(!escrow.released, "Escrow already released");
        require(!escrow.disputed, "Escrow is disputed");
        require(escrow.worker != address(0), "Worker not assigned");

        escrow.released = true;

        // Calculate platform fee
        uint256 platformFee = (escrow.amount * PLATFORM_FEE_PERCENTAGE) / 100;
        uint256 workerAmount = escrow.amount - platformFee;

        // Transfer platform fee to treasury
        (bool feeSuccess, ) = payable(TREASURY).call{value: platformFee}("");
        require(feeSuccess, "Platform fee transfer failed");
        emit PlatformFeeCollected(jobId, platformFee);

        // Transfer remaining amount to worker
        (bool success, ) = payable(escrow.worker).call{value: workerAmount}("");
        require(success, "Worker payment failed");

        emit EscrowReleased(jobId, escrow.worker, workerAmount);
    }

    function disputeEscrow(
        uint256 jobId
    ) external override escrowExists(jobId) {
        Escrow storage escrow = _escrows[jobId];
        require(!escrow.released, "Escrow already released");
        require(!escrow.disputed, "Escrow already disputed");
        require(
            msg.sender == escrow.client || msg.sender == escrow.worker,
            "Only client or worker can dispute"
        );

        escrow.disputed = true;
        emit EscrowDisputed(jobId, msg.sender);
    }

    function resolveDispute(
        uint256 jobId,
        address recipient,
        uint256 amount
    ) external override onlyOwner escrowExists(jobId) nonReentrant {
        Escrow storage escrow = _escrows[jobId];
        require(escrow.disputed, "Escrow not disputed");
        require(!escrow.released, "Escrow already released");
        require(amount <= escrow.amount, "Amount exceeds escrow");
        require(
            recipient == escrow.client || recipient == escrow.worker,
            "Invalid recipient"
        );

        escrow.released = true;

        // Calculate and transfer platform fee
        uint256 platformFee = (amount * PLATFORM_FEE_PERCENTAGE) / 100;
        uint256 recipientAmount = amount - platformFee;

        // Transfer platform fee
        (bool feeSuccess, ) = payable(TREASURY).call{value: platformFee}("");
        require(feeSuccess, "Platform fee transfer failed");
        emit PlatformFeeCollected(jobId, platformFee);

        // Transfer resolved amount
        (bool success, ) = payable(recipient).call{value: recipientAmount}("");
        require(success, "Recipient payment failed");

        // Return remaining amount to client if any
        uint256 remainingAmount = escrow.amount - amount;
        if (remainingAmount > 0) {
            (bool refundSuccess, ) = payable(escrow.client).call{value: remainingAmount}("");
            require(refundSuccess, "Refund payment failed");
        }

        emit EscrowResolved(jobId, recipient, recipientAmount);
    }

    function getEscrow(
        uint256 jobId
    ) external view override returns (Escrow memory) {
        require(_escrows[jobId].client != address(0), "Escrow does not exist");
        return _escrows[jobId];
    }

    function isEscrowReleased(
        uint256 jobId
    ) external view override returns (bool) {
        return _escrows[jobId].released;
    }

    function isEscrowDisputed(
        uint256 jobId
    ) external view override returns (bool) {
        return _escrows[jobId].disputed;
    }

    // Allow contract to receive ETH
    receive() external payable {}
    fallback() external payable {}
}

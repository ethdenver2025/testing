// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IFormicaryReputation.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FormicaryReputation is IFormicaryReputation, Ownable, ReentrancyGuard {
    mapping(address => WorkerProfile) private _workerProfiles;
    mapping(address => string[]) private _workerSkills;
    mapping(address => mapping(string => mapping(address => bool))) private _skillValidations;
    
    uint256 private constant VALIDATION_THRESHOLD = 3;
    uint256 private constant MAX_REPUTATION = 100;
    uint256 private constant MIN_REPUTATION = 0;

    modifier skillExists(address worker, string memory skillName) {
        require(bytes(skillName).length > 0, "Skill name cannot be empty");
        require(_workerProfiles[worker].skills[skillName].level > 0, "Skill does not exist");
        _;
    }

    function updateReputation(
        address worker,
        uint256 jobId,
        uint256 score
    ) external override onlyOwner {
        require(score <= MAX_REPUTATION, "Score exceeds maximum");
        
        WorkerProfile storage profile = _workerProfiles[worker];
        
        // Calculate new reputation as weighted average
        uint256 totalJobs = profile.completedJobs + 1;
        uint256 newReputation = (profile.reputation * profile.completedJobs + score) / totalJobs;
        
        profile.reputation = newReputation;
        profile.completedJobs++;
        
        emit ReputationUpdated(worker, newReputation);
    }

    function addSkill(
        string memory skillName,
        uint256 level
    ) external override nonReentrant {
        require(bytes(skillName).length > 0, "Skill name cannot be empty");
        require(level > 0 && level <= 5, "Invalid skill level");

        WorkerProfile storage profile = _workerProfiles[msg.sender];
        
        if (profile.skills[skillName].level == 0) {
            _workerSkills[msg.sender].push(skillName);
        }
        
        profile.skills[skillName] = Skill({
            name: skillName,
            level: level,
            validations: 0,
            verified: false
        });

        emit SkillAdded(msg.sender, skillName, level);
    }

    function validateSkill(
        address worker,
        string memory skillName
    ) external override skillExists(worker, skillName) {
        require(msg.sender != worker, "Cannot validate own skill");
        require(!_skillValidations[worker][skillName][msg.sender], "Already validated this skill");

        WorkerProfile storage profile = _workerProfiles[worker];
        Skill storage skill = profile.skills[skillName];

        _skillValidations[worker][skillName][msg.sender] = true;
        skill.validations++;

        if (skill.validations >= VALIDATION_THRESHOLD && !skill.verified) {
            skill.verified = true;
            emit SkillVerified(worker, skillName);
        }

        emit SkillValidated(worker, skillName, msg.sender);
    }

    function verifySkill(
        address worker,
        string memory skillName
    ) external override onlyOwner skillExists(worker, skillName) {
        WorkerProfile storage profile = _workerProfiles[worker];
        profile.skills[skillName].verified = true;
        emit SkillVerified(worker, skillName);
    }

    function getWorkerReputation(
        address worker
    ) external view override returns (uint256) {
        return _workerProfiles[worker].reputation;
    }

    function getWorkerSkill(
        address worker,
        string memory skillName
    ) external view override returns (Skill memory) {
        return _workerProfiles[worker].skills[skillName];
    }

    function isSkillVerified(
        address worker,
        string memory skillName
    ) external view override returns (bool) {
        return _workerProfiles[worker].skills[skillName].verified;
    }

    function getWorkerSkills(
        address worker
    ) external view returns (string[] memory) {
        return _workerSkills[worker];
    }
}

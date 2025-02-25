// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFormicaryReputation {
    struct Skill {
        string name;
        uint256 level;
        uint256 validations;
        bool verified;
    }

    struct WorkerProfile {
        address worker;
        uint256 reputation;
        uint256 completedJobs;
        uint256 disputedJobs;
        mapping(string => Skill) skills;
    }

    event ReputationUpdated(address indexed worker, uint256 newReputation);
    event SkillAdded(address indexed worker, string skillName, uint256 level);
    event SkillValidated(address indexed worker, string skillName, address validator);
    event SkillVerified(address indexed worker, string skillName);

    function updateReputation(address worker, uint256 jobId, uint256 score) external;
    function addSkill(string memory skillName, uint256 level) external;
    function validateSkill(address worker, string memory skillName) external;
    function verifySkill(address worker, string memory skillName) external;
    function getWorkerReputation(address worker) external view returns (uint256);
    function getWorkerSkill(address worker, string memory skillName) external view returns (Skill memory);
    function isSkillVerified(address worker, string memory skillName) external view returns (bool);
}
